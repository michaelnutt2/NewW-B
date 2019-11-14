var express = require('express');
var router = express.Router();

// Require controller module
var article_controller = require('../controllers/articleController');

/// Not Signed In Routes ///

// GET home page and user login form defualts
router.get('/', article_controller.index);

// GET tag page
router.get('/tags/:id', article_controller.tag_detail);

// GET Author list
//router.get('/author/list', article_controller.author_list);

// GET Author Page
router.get('/author/:id', article_controller.author_detail);

// GET article page
router.get('/:id', article_controller.article_detail);

router.get('/keywords/:id', article_controller.keyword_detail);
// GET User login From
//router.get('/user/login', user_controller.login_create)

router.post('/:id', article_controller.submit_comment);


module.exports = router;