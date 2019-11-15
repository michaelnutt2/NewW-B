var Users = require('../models/users');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities

exports.logout= function(req, res){
    req.logout();
    res.redirect('/');
};

function createUser(callback, req){

  Users.findOne({u_id:req.body.username}).then(function(result){
        if (result === null) {
            if (req.body.new_pass1==req.body.new_pass2){
                var user = new Users({u_id: req.body.username, 
                                        f_name:req.body.f_name, 
                                        l_name:req.body.l_name, 
                                        email:req.body.email,
                                        pw:req.body.new_pass1});
                user.save();
                } else{
                    req.flash('error_messages','Passwords do not match');
                };
        }else{
            req.flash('error_messages','User already exists'); 
        };
        callback();
    });
};

function deleteUser(callback, req){
    Users.deleteOne({u_id:req.user.u_id}).exec(callback);
}

exports.create_user = function(req, res, next){
    async.parallel({
        update: function(callback) {
            createUser(callback, req, res)
        }
    }, function(err, result) {
        if(err) { return next(err);}
        req.session.save( function(err) {
            req.session.reload( function (err) {
                res.redirect('/article');
            });    
        });
    });
};

exports.delete_user = function(req, res, next){
    async.parallel({
        update: function(callback) {
            deleteUser(callback, req, res)
        }
    }, function(err, result) {
        if(err) { return next(err);}
        req.session.save( function(err) {
            req.session.reload( function (err) {
                res.redirect('/article');
            });    
        });
    });
};