var LocalStratgery = require('passport-local').Strategy;

var User = require('../models/users');

module.export = function(passport){
    passport.serializeUser(function(user, done){
        done(null, used.id);
    });

    passport.deserialzeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStratgery({
        passReqToCallback: true
    }, 
    function(req, username, password, done){
        process.nextTick(function(){
            User.findOne({u_id: username}, function(err, user){
                if(err)
                    return done(err);
                if(user) {
                    return done(null, false, req.flash('signupMessage', 'user name already taken'));
                } else {
                    var newUser = new User();
                    newUser.u_id = username;
                    newUser.pw = password;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser)
                    });
                };
            });
        });
    }
))};

