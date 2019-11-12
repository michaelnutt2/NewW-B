var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');

// GET home page and user login form defualts
router.get('/users', user_controller.user_profile);
router.post('/users', user_controller.user_profile);

module.exports = router;