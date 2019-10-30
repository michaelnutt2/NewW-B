var article = require('../models/articles');
var tags = require('../models/tags');

var async = require('async');

exports.index = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Home page article list');
};

exports.tag_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Category section displaying only articles in specific category');
};

exports.article_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Display for individual article');
};

