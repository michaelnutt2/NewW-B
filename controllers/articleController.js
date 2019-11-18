var Article = require('../models/articles');
var Tags = require('../models/tags');
var Users = require('../models/users')
var Comment = require('../models/comments');

var path = require('path');
var fs = require('fs');
var async = require('async');
const validator = require('express-validator');

function findTags(callback,user) {
    if (user === undefined){
        Tags.find()
        .sort([['tag', 'ascending']])
        .exec(callback);
    } else {
        Users.findOne({'u_id':user.u_id}, {'follows':1}).then(function(follows){
            Tags.find({'tag': { $in: follows.follows}})
            .sort([['tag', 'ascending']])
            .exec(callback);
        });
    };
};

function sidebar(callback) {
    Article.aggregate(
        [{"$unwind":"$keywords"}, {"$sortByCount":"$keywords"}, {"$limit":10}]
    ).exec(callback);
}

exports.index = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback,req.user);
        },
        sidebar: function(callback) {
            sidebar(callback);
        },
        list_articles: function(callback) {
            Article.find()
            .sort([['date', 'ascending'],['rank','ascending']])
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err);}
        //var username = null;
        res.render('article_view', {
            title: 'NewW-B News Aggregator', 
            tag_list: result.tags, 
            sidebar: result.sidebar,
            article_list: result.list_articles, 
            user: req.user, 
            name: "/"
        });
    });
};

exports.tag_detail = function(req, res, next) {
    async.parallel({
        tag: function(callback) {
            Tags.findById(req.params.id)
            .exec(callback);
        },
        sidebar: function(callback) {
            sidebar(callback);
        },
        list_articles: function(callback) {
            var tag_promise = new Promise(function(resolve, reject) {
                Tags.findById(req.params.id)
                .exec(function(err, tag){
                    err
                        ? reject(err)
                        : resolve(tag);
                });
            });
            tag_promise.then(function(tag) {
                //console.log(tag.tag);
                Article.find({tags: tag.tag})
                .exec(callback);
            });
        },
        list_tags: function(callback){
            findTags(callback, req.user);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        if(results.tag == null) {
            var err = new Error('Tag not found');
            err.status = 404;
            return next(err);
        }
        res.render('article_view', {
            title: results.tag.tag, 
            tag: results.tag, 
            sidebar: results.sidebar,
            article_list: results.list_articles, 
            tag_list: results.list_tags, 
            name: results.tag.tag, 
            user: req.user
        });
    });
};

exports.author_detail = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback, req.user);
        },
        sidebar: function(callback) {
            sidebar(callback);
        },
        article_list: function(callback) {
            auth_split = req.params.id.split("_");
            author = auth_split[0]
            for(var i = 1; i < auth_split.length; i++) {
                author += " " + auth_split[i];
            }
            //console.log(author);
            Article.find({author: author})
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err); }
        res.render('article_view', {
            title:'NewW-B News Aggregator',
            sidebar: result.sidebar, 
            tag_list: result.tags, 
            article_list: result.article_list, 
            name: "/"
        });
    });
};

exports.author_list = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Display for Author List');
};

exports.article_detail = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback, req.user);
        },
        details: function(callback) {
            Article.findById(req.params.id, {'title': 1, 'filepath':1, 'comments': 1})
            .exec(callback);
        },
        users: function(callback) {
            Article.findById(req.params.id, {'comments':1})
            .then(function(comments){
                var uids = [];
                for(comment of comments.comments) {
                    uids.push(comment.u_id);
                }
                Users.find({'_id': { $in: uids}}, {'u_id': 1})
                .exec(callback);
            });
        },
        sidebar: function(callback) {
            sidebar(callback);
        }
    }, function(err, results) {
        if(err) {
            console.log(err);
            return next(err);
        }
        var details = results.details;
        var u = {};
        for(user of results.users) {
            u[user._id] = user.u_id;
        }

        p = path.join(__dirname, details.filepath);
        var contents = fs.readFileSync(p, 'utf8');
        res.render('article_detail', {
            title: details.title,
            users: u,
            user: req.user,
            comments: details.comments,
            article_text: contents,
            tag_list: results.tags,
            sidebar: results.sidebar,
            name: "/"
        });
    });
};

exports.keyword_detail = function(req, res, next) {
    var key = decodeURI(req.params.id);
    async.parallel({
        sidebar: function (callback) {
            sidebar(callback);
        },
        tags: function(callback) {
            findTags(callback);
        },
        details: function(callback) {
            Article.find({keywords: key})
            .exec(callback);
        },
    }, function(err, result) {
        if(err) {return next(err)};
        res.render('article_view', {
            title: key,
            sidebar: result.sidebar,
            article_list: result.details,
            tag_list: result.tags,
            user: req.user,
            name: "/"
        });
    });
};

exports.submit_comment = [
    // Validate not an empty comment
    validator.body('text', 'Enter text here').isLength({min: 1}).trim(),

    // Sanitize the field
    validator.sanitizeBody('text').escape(),

    // Process the request
    (req, res, next) => {
        const errors = validator.validationResult(req);

        var comment = new Comment(
            {
                u_id: req.user.id,
                text: req.body.text,
                date: + Date.now(),
                rank: 0
            }
        );
        if(!errors.isEmpty()) {
            res.send('INVALID COMMENT GO BACK AND TRY AGAIN');
        } else {
            Article.updateOne({"_id": req.params.id}, {
                $push: {comments: comment}
            }).exec(function(err, article){
                if(err) {return next(err);}
            })
            res.redirect('/article/'+req.params.id);
        }
    }
]

exports.search = [
    // Validate not an empty comment
    validator.body('search', 'Enter search here').isLength({min: 1}).trim(),

    // Sanitize the field
    validator.sanitizeBody('search').escape(),

    // Process the request
    (req, res, next) => {
        const errors = validator.validationResult(req);
        if(!errors.isEmpty()) {
            res.send("Invalid Search!");
        }
        async.parallel({
            tags: function(callback) {
                findTags(callback,req.user);
            },
            sidebar: function(callback) {
                sidebar(callback);
            },
            list_articles: function(callback) {
                console.log(req.body.search);
                Article.find({$or: [{'text': {$regex: req.body.search}}, {'title': {$regex: req.body.search}}, {'keywords': req.body.search}]})
                .sort([['rank', 'ascending']])
                .exec(callback);
            }
        }, function(err, result) {
            if(err) {return next(err);}
            //console.log(result.list_articles);
            res.render('article_view',{
                tag_list: result.tags,
                sidebar: result.sidebar,
                article_list: result.list_articles,
                user: req.user,
                name: "/"
            });
        });
    }
]
