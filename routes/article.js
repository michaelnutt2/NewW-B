var express = require('express');
var router = express.Router();

// Require controller module
var article_controller = require('../controllers/articleController');
var user_controller = require('../controllers/userController');

/// Not Signed In Routes ///

// GET home page and user login form defualts
router.get('/', [article_controller.index, user_controller.login_get]);

// GET tag page
router.get('/article/tags/:id', article_controller.tag_detail);

// GET article page
router.get('/article/:id', article_controller.article_detail);

// GET User login From
//router.get('/user/login', user_controller.login_create)

// Login a user
router.post('/', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

module.exports = router;