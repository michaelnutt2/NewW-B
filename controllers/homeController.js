var Article = require('../models/articles');
var Users = require('../models/users');
var Tags = require('../models/tags');
var Comments = require('../models/comments');

var async = require('async');

exports.index = function(req, res) {
        Tags.find()
        .sort([['tag', 'ascending']])
        .exec(function(err, list_tags) {
            if(err) {return next(err);}
            res.render('index', {title: 'NewW-B News Aggregator', tag_list: list_tags});
        });
};