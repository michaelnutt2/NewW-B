var Article = require('../models/articles');
var Tags = require('../models/tags');
var Users = require('../models/users')

var path = require('path');
var fs = require('fs');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities();

function findTags(callback,user) {
    Tags.find()
    .sort([['tag', 'ascending']])
    .exec(callback);
};


exports.index = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback,req.user);
        },
        list_articles: function(callback) {
            Article.find()
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err);}
        res.render('article_view', {title: 'NewW-B News Aggregator', tag_list: result.tags, article_list: result.list_articles, user: req.user, name: "/"})
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
    }, function(err, results) {
        if(err) {return next(err);}
        console.log(__dirname);
        p = path.join(__dirname, results.details.filepath);
        var contents = fs.readFileSync(p, 'utf8');
        res.render('article_detail', {
            title: results.details.title, 
            article_detail: results.detail,
            article_text: contents,
            tag_list: results.tags,
            name: "/"
        });
    });
};