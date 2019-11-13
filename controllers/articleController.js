var Article = require('../models/articles');
var Tags = require('../models/tags');
var Users = require('../models/users')

var path = require('path');
var fs = require('fs');
var async = require('async');

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
    Article.distinct('keywords')
    .exec(callback);
}

function formatSidebar(keywords) {
    var keys = [10];
    for(var i = 0; i < 10; i++) {
        keys[i] = keywords[i];
    }

    return keys;
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
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err);}
        //var username = null;
        keys = formatSidebar(result.sidebar);
        res.render('article_view', {
            title: 'NewW-B News Aggregator', 
            tag_list: result.tags, 
            sidebar: keys,
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
                console.log(tag.tag);
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
        //console.log(results.list_tags)
        res.render('article_view', {title: results.tag.tag, tag: results.tag, article_list: results.list_articles, tag_list: results.list_tags, name: results.tag.tagm, user: req.user});
    });
};

exports.author_detail = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback, req.user);
        },
        article_list: function(callback) {
            auth_split = req.params.id.split("_");
            author = auth_split[0]
            for(var i = 1; i < auth_split.length; i++) {
                author += " " + auth_split[i];
            }
            console.log(author);
            Article.find({author: author})
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err); }
        console.log(results.list_tags)
        res.render('article_view', {title:'NewW-B News Aggregator', tag_list: result.tags, article_list: result.article_list, name: "/"})
    })
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
            Article.findById(req.params.id)
            .exec(callback);
        },
        comments: function(callback) {
            article_promise = new Promise(function(resolve, reject) {
                Article.findById(req.params.id)
                .exec(function(err, article){
                    err
                        ? reject(err)
                        : resolve(article)
                });
            });
            article_promise.then(function(article) {
                callback = [];
                console.log("Article: " + article);
                for (comment of article.comments) {
                    User.findById(comment.u_id)
                    .exec(function(err, user){
                        if(err) {return next(err);}
                        callback.push([user.u_id, comment]);
                    });
                }
            });
        },
        sidebar: function(callback) {
            sidebar(callback);
        }
    }, function(err, results) {
        if(err) {return next(err);}
        console.log(__dirname);
        p = path.join(__dirname, results.details.filepath);
        var contents = fs.readFileSync(p, 'utf8');
        res.render('article_detail', {
            title: results.details.title, 
            comments: results.comments,
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
        keys = formatSidebar(result.sidebar);
        res.render('article_view', {
            title: key,
            sidebar: keys,
            article_list: result.details,
            tag_list: result.tags,
            user: req.user,
            name: "/"
        });
    });
};