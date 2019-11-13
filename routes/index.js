var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/article');
});

/* GET home page. */
router.get('/user', function(req, res, next) {
  res.redirect('/user');
});

module.exports = router;
