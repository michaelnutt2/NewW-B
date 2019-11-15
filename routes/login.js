var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport)

// Require controller modules
var login_controller = require('../controllers/loginController');

// GET home page and user login form defualts
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/article', // redirect back but logged in
    failureRedirect : '/article', // redirect back but not logged in
    failureFlash : true // allow flash messages
}));

// logout
router.post('/logout', login_controller.logout);
router.post('/create_user', login_controller.create_user)
router.post('/delete_user', login_controller.delete_user)


module.exports = router;