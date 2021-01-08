var express = require('express');
var router = express.Router();
// const mongodb = require('../mongodb/connection.js');

// const db = mongodb;

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/');
});

module.exports = router;
