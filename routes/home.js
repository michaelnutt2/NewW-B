var express = require('express');
var router = express.Router();

var articleController = require('../controllers/homeController');

router.get('/', articleController.index);

module.exports = router;