var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../persistence/db');

router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .find({ id: id })
    .value();

  res.render('details', { event: event });
});

module.exports = router;
