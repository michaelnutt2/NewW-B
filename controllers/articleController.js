var Article = require('../models/articles');
var Tags = require('../models/tags');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

function findTags(callback) {
    Tags.find()
    .sort([['tag', 'ascending']])
    .exec(callback);
}

exports.index = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback);
        },
        list_articles: function(callback) {
            Article.find()
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err);}
        res.render('index', {title: 'NewW-B News Aggregator', tag_list: result.tags, article_list: result.list_articles, name: "/"})
    });
};

exports.tag_detail = function(req, res, next) {
    async.parallel({
        tag: function(callback) {
            Tags.findById(req.params.id)
            .exec(callback);
        },
        list_articles: function(callback) {
            Article.find({tags: req.params.id})
            .exec(callback);
        },
        list_tags: function(callback){
            findTags(callback);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        if(results.tag == null) {
            var err = new Error('Tag not found');
            err.status = 404;
            return next(err);
        }
        res.render('tag_detail', {title: results.tag.tag, tag: results.tag, article_list: results.list_articles, tag_list: results.list_tags, name: results.tag.tag});
    });
};

exports.article_list_all = function(req, res, next) {
    Article.find()
    .exec(function(err, list_articles) {
        if(err) { return next(err);}
        if(list_articles == null){
            
        }
    })
};

exports.article_list_tag = function(req, res, next) {

}

exports.article_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Display for individual article');
};

exports.login = function(req, res, next) {
    res.send(req.body.InputUser+'Working on Login Authentication');
};