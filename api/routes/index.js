var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.render('index', { title: 'Express' });
});

module.exports = router;
