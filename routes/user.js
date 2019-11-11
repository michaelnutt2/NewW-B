var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');

// GET home page and user login form defualts
router.get('/user', user_controller.index);
router.post('/user', user_controller.index);

module.exports = router;