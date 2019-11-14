var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');

// GET home page and user login form defualts
router.get('/', user_controller.user_profile);
router.post('/', user_controller.user_profile);
router.post('/mod_user', user_controller.mod_user);
router.post('/change_pass', user_controller.change_pass);
router.post('/delete', user_controller.delete);

module.exports = router;