var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport)

// Require controller module
var article_controller = require('../controllers/articleController');

/// Not Signed In Routes ///

// GET home page and user login form defualts
router.get('/', article_controller.index);

// GET tag page
router.get('/article/tags/:id', article_controller.tag_detail);

// GET Author list
router.get('/article/author/list', article_controller.author_list);

// GET Author Page
router.get('/article/author/:id', article_controller.author_detail);

// GET article page
router.get('/article/:id', article_controller.article_detail);

router.get('/article/keywords/:id', article_controller.keyword_detail);
// GET User login From
//router.get('/user/login', user_controller.login_create)

// Login a user
router.post('/', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

module.exports = router;