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

function changePass(callback,req) {
    Users.findOne({u_id:req.user.u_id}).then(function(record){
        if (record.pw === req.body.old_pass) {
            if (req.body.new_pass1 === req.body.new_pass2) {
                return Users.findOneAndUpdate({u_id:req.user.u_id},{pw:req.body.new_pass1})
                       .exec(callback)
            }else{
                req.flash('pass_error','New passwords do not match');
            };
        }else{
            req.flash('pass_error','Old Passwords do not match');
        };
        callback()
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
        errors: function(callback) {
            changePass(callback, req, res)
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

exports.upvote = function(req, res, next) {
    var found = false;
    for(vote of req.user.voted_on) {
        if(req.params.id == vote.article) {
            found = true;
            if(vote.vote == 1) {
                async.parallel({
                    update_user: function(callback) {
                        Users.updateOne({"_id": req.user.id}, {
                            $pull: {
                                "voted_on": {
                                    "article": req.params.id,
                                    "vote": 1
                                }
                            }
                        }).exec(callback);
                    },
                    update_article: function(callback) {
                        Article.updateOne({"_id": req.params.id}, {
                            $inc: {"rank": -1}
                        }).exec(callback);
                    }
                }, function(err, result) {
                    if(err) {return next(err);}
                    return res.sendStatus(201);
                });
            } else {
                console.log("Case 2: Changing Vote");
                async.parallel({
                    update_user: function(callback) {
                        Users.updateOne({"_id": req.user.id}, {
                            $pull: {
                                "voted_on": {
                                    "article": req.params.id,
                                    "vote": -1
                                }
                            }
                        }).then(function(){
                            Users.updateOne({"_id": req.user.id}, {
                                $push: {"voted_on": {"article": req.params.id, "vote": 1}}
                            }).exec(callback);
                        });
                    },
                    update_article: function(callback) {
                        Article.updateOne({"_id": req.params.id}, {
                            $inc: {"rank": 2}
                        }).exec(callback);
                    }
                }, function(err, result) {
                    if(err) {return next(err);}
                    return res.sendStatus(202);
                });
            }
        }
    }

    if(!found){
        async.parallel({
            update_user: function(callback) {
                Users.updateOne({"_id": req.user.id}, {
                    $push: {"voted_on": {"article": req.params.id, "vote": 1}}
                }).exec(callback);
            },
            update_article: function(callback) {
                Article.updateOne({"_id": req.params.id}, {
                    $inc: {"rank": 1}
                }).exec(callback);
            }
        }, function(err, result) {
            if(err) {return next(err);}
            return res.sendStatus(203);
        });
    }
}

exports.downvote = function(req, res, next) {
    var found = false;
    for(vote of req.user.voted_on) {
        if(req.params.id == vote.article) {
            found = true;
            if(vote.vote == -1) {
                async.parallel({
                    update_user: function(callback) {
                        Users.updateOne({"_id": req.user.id}, {
                            $pull: {
                                "voted_on": {
                                    "article": req.params.id,
                                    "vote": -1
                                }
                            }
                        }).exec(callback);
                    },
                    update_article: function(callback) {
                        Article.updateOne({"_id": req.params.id}, {
                            $inc: {"rank": 1}
                        }).exec(callback);
                    }
                }, function(err, result) {
                    if(err) {return next(err);}
                    return res.sendStatus(201);
                });
            } else if(vote.vote == 1){
                async.parallel({
                    update_user: function(callback) {
                        Users.updateOne({"_id": req.user.id}, {
                            $pull: {
                                "voted_on": {
                                    "article": req.params.id,
                                    "vote": 1
                                }
                            }
                        }).then(function(){
                            Users.updateOne({"_id": req.user.id}, {
                                $push: {"voted_on": {"article": req.params.id, "vote": -1}}
                            }).exec(callback);
                        });
                    },
                    update_article: function(callback) {
                        Article.updateOne({"_id": req.params.id}, {
                            $inc: {"rank": -2}
                        }).exec(callback);
                    }
                }, function(err, result) {
                    if(err) {return next(err);}
                    return res.sendStatus(202);
                });
            }
        }
    }

    if(!found) {
        async.parallel({
            update_user: function(callback) {
                Users.updateOne({"_id": req.user.id}, {
                    $push: {"voted_on": {"article": req.params.id, "vote": -1}}
                }).exec(callback);
            },
            update_article: function(callback) {
                Article.updateOne({"_id": req.params.id}, {
                    $inc: {"rank": -1}
                }).exec(callback);
            }
        }, function(err, result) {
            if(err) {return next(err);}
            return res.sendStatus(203);
        });
    }
}

exports.removevote = function(req, res, next) {
    res.sendStatus(200);
}