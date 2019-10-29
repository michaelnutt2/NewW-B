var Article = require('../models/articles');
var Users = require('../models/users');
var Tags = require('../models/tags');
var Comments = require('../models/comments');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        article_count: function(callback) {
            Article.countDocuments({}, callback);
        },
        user_count: function(callback) {
            Users.countDocuments({}, callback);
        }
    }, function(err, results){
        res.render('index', {title: 'NewW-B News Aggregator', error: err, data: results});
    });
};