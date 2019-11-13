var Article = require('../models/articles');
var Tags = require('../models/tags');
var Users = require('../models/users');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities();

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

exports.user_profile = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback,req.user);
        }
    }, function(err, result) {
        if(err) { return next(err);}
        //var username = null;
        res.render('user_view', {
            title: 'NewW-B News Aggregator', 
            tag_list: result.tags, 
            user: req.user, 
            name: "/"
        });
    });
};
