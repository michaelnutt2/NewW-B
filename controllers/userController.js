var Article = require('../models/articles');
var Tags = require('../models/tags');
var Users = require('../models/users');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities();


exports.user_profile = function(req, res) {
    res.send('NOT IMPLEMENTED YET');
};
