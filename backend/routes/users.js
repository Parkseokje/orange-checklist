var express = require('express');
var router = express.Router();
var users = require('../mockup/users.json');

router.get('/', function (req, res, next) {
  res.send(users)
});

router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id, 10)
  var movie = users.filter(function (movie) {
    return movie.id === id
  });
  res.send(movie)
});

module.exports = router;
