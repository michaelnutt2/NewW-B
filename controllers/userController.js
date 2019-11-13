var Article = require('../models/articles');
var Tags = require('../models/tags');
var Users = require('../models/users');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities();

function findTags(callback,user) {
    Users.findOne({'u_id':user.u_id}, {'follows':1}).then(function(follows){
        Tags.find({'tag': { $in: follows.follows}})
        .sort([['tag', 'ascending']])
        .exec(callback);
    });
};

function findFavorites(callback,user) {
    Users.findOne({u_id:user.u_id}, {_id:0,favorites:1}).then(function(favorites){
        Article.find({'_id': { $in: favorites.favorites}},{title:1, })
        .exec(callback);
    });
};

function findVotes(callback,user) {
    Users.findOne({u_id:user.u_id},{voted_on:1})
    .populate({path: 'voted_on.article', model: Article, select:'title'})
    .exec(callback) 
};

function findComments(callback,user) {
    Users.findOne({u_id:user.u_id}, {_id:0,commented_on:1}).then(function(commented_on){
        Article.find({_id: { $in: commented_on.commented_on}},{title:1})
        .exec(callback);
    });
};


exports.user_profile = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback,req.user);
        },
        favorites: function(callback) {
            findFavorites(callback,req.user);
        },
        votes: function(callback) {
            findVotes(callback,req.user);
        },
        comments: function(callback) {
            findComments(callback,req.user);
        }   
    }, function(err, result) {
        if(err) { return next(err);}
        res.render('user_view', {
            title: 'NewW-B News Aggregator', 
            tag_list: result.tags, 
            user: req.user,
            favorite_list: result.favorites , 
            voted_on_list: result.votes,
            commented_on_list: result.comments, 
            name: "/"
        });
    });
};
