var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');

// GET home page and user login form defualts
router.get('/', user_controller.user_profile);
router.post('/', user_controller.user_profile);

router.post('/favorites/:id/favorited', user_controller.add_favorite);
module.exports = router;