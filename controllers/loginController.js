var Users = require('../models/users');
var async = require('async');
const Entities = require('html-entities').AllHtmlEntities

exports.logout= function(req, res){
    req.logout();
    res.redirect('/');
};

function createUser(callback, req){

    var query = Users.findOne({u_id:req.body.username}).then(function(result){
        console.log(result)
        if (result === null) {
            console.log('User is unique');
            if (req.body.new_pass1==req.body.new_pass2){
                console.log('Creating Password')
                var user = new Users({u_id: req.body.username, 
                                        f_name:req.body.f_name, 
                                        l_name:req.body.l_name, 
                                        email:req.body.email,
                                        pw:req.body.new_pass1});
                user.save();
                } else{
                    console.log('passwords do not match');
                    req.flash('error_messages','Passwords do not match');
                };
        }else{
            console.log('user already exists');
            req.flash('error_messages','User already exists'); 
        };
        callback();
    });
};



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