var passport = require('passport');



// Display login form on GET.
exports.login_get = function(req, res, next) {       
    res.render('navbar', {title: "Login Form"});
  };

// Evalute login details
exports.login_post = function(req, res, next){
    passport.authenticate('local-login', {failureRedirect: '/'}),
    function(){res.redirect('/')}; 
    };
