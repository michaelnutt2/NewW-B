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

function allTags(callback) {
    Tags.find({}, {tag:1})
    .sort([['tag', 'ascending']])
    .exec(callback)
}

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

function updateUser(callback, req){
    Users.findOneAndUpdate({u_id:req.user.u_id},
                           {f_name:req.body.f_name, 
                            l_name:req.body.l_name, 
                            email:req.body.email}).exec(callback)
};

function changePass(callback,req, res) {
    Users.findOne({u_id:req.user.u_id}).then(function(record){
        var err = []
        if (record.pw === req.body.old_pass) {
            if (req.body.new_pass1 === req.body.new_pass2) {
                Users.findOneAndUpdate({u_id:req.user.u_id},{pw:req.body.new_pass1})
                .exec(callback)
            }else{
                err.push('New passwords do not match');
            };
        }else{
            err.push('Old Passwords do not match');
        };
        console.log(err);
        return err
    });
};

function changeSubs(callback, req, res) {
    var tag_list = [];
    for (tag in req.body){
        tag_list.push(tag)
    }
    console.log(tag_list)
    Users.findOneAndUpdate({u_id:req.user.u_id}, {follows:tag_list}).exec(callback)
};

exports.user_profile = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback,req.user);
        },
        all_tags: function(callback) {
            allTags(callback);
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
            all_tags: result.all_tags, 
            user: req.user,
            favorite_list: result.favorites , 
            voted_on_list: result.votes,
            commented_on_list: result.comments, 
            name: "/"
          });
    });
};


exports.mod_user = function(req, res, next){
    async.parallel({
        update: function(callback) {
            updateUser(callback, req, res)
        }
    }, function(err, result) {
        if(err) { return next(err);}
        req.session.save( function(err) {
            req.session.reload( function (err) {
                res.redirect('/user');
            });    
        });
    });
};

exports.change_pass = function(req, res, next){
    async.parallel({
        update: function(callback) {
            changePass(callback, req, res)
        }
    }, function(err) {
        if(err) { return next(err);}
        req.session.save( function(err) {
            req.session.reload( function (err) {
                res.redirect('/user')
            });    
        });
    });
};

exports.change_subs = function(req, res, next) {
    async.parallel({
        update: function(callback) {
            changeSubs(callback, req, res)
        }
    }, function (err) {
        if(err) { return next(err);} 
        req.session.save( function(err) {
            req.session.reload( function (err) {
                res.redirect('/user')
            });    
        });
    });
};

exports.add_favorite = function(req, res, next) {
    Users.updateOne({_id: req.user.id}, {
        $push: { favorites: req.params.id}
    }).exec(function(err, user) {
        if(err) {return next(err);}
        res.sendStatus(200);
    })
}

exports.remove_favorite = function(req, res, next) {
    Users.updateOne({_id: req.user.id}, {
        $pull: { favorites: req.params.id}
    }).exec(function(err, user) {
        if(err) {return next(err);}
        res.sendStatus(200);
    });
}
