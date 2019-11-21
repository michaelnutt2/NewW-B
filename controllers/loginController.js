var Users = require('../models/users');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities
const validator= require('express-validator');
var passport = require('passport');
require('../config/passport')(passport)

function createUser(callback, req, res){

  Users.findOne({u_id:req.body.username}).then(function(result){
        if (result === null) {
            if (req.body.new_pass1==req.body.new_pass2){
                var user = new Users({u_id: req.body.username, 
                                        f_name:req.body.f_name, 
                                        l_name:req.body.l_name, 
                                        email:req.body.email,
                                        pw:req.body.password});
                user.save();

                } else{
                    req.flash('user_error','Passwords do not match');
                };
        }else{
            req.flash('user_error','User already exists'); 
        };
        console.log(req.flash());
        callback();
    });
};

function deleteUser(callback, req){
    Users.deleteOne({u_id:req.user.u_id}).exec(callback);
}

exports.create_user = [
    validator.body('f_name').trim(),
    validator.body('l_name').trim(),
    validator.body('email').isLength({ min: 1 }).trim(),
    validator.body('username', 'User name must not be empty').isLength({ min: 1 }).trim(),
    validator.body('password','Password must not be empty').isLength({ min: 1 }).trim(),
    validator.body('password2','Password must not be empty').isLength({ min: 1 }).trim(),
    validator.sanitizeBody('*').escape(),

    (req, res, next) => {

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()){ 
            req.flash('user_error', errors.errors);
            req.session.save(function(){
                req.session.reload(function(){
                    res.redirect('/article');
                });    
            });

        } else {
            async.parallel({
                update: function(callback) {
                    createUser(callback, req, res);
                }
            }, function(err){
                if(err) { return next(err);}
                req.session.save(function(){
                    req.session.reload(function(){
                        //res.redirect('/article');
                        passport.authenticate('local-login')(req, res, function () {
                            res.redirect('/article');     
                        });
                    });    
                });
            });
        };
    }
];

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

exports.logout= function(req, res){
    req.logout();
    res.redirect('/');
};