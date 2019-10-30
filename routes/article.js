var express = require('express');
var router = express.Router();

// Require controller module
var article_controller = require('../controllers/articleController');

/// Not Signed In Routes ///

// GET home page
router.get('/', article_controller.index);

// GET tag page
router.get('/article/tag/:id', article_controller.tag_detail);

// GET article page
router.get('/article/:id', article_controller.article_detail);

module.exports = router;