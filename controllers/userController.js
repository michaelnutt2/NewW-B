var Article = require('../models/articles');
var Tags = require('../models/tags');

var async = require('async');
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities();

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
        //var username = null;
        res.render('user_view', {title: 'NewW-B News Aggregator', tag_list: result.tags, article_list: result.list_articles, user: req.user, name: "/"})
    });
};
