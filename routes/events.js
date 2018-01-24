var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../persistence/db');

router.get('/new', function(req, res, next) {
  const lastId = db
    .get('events')
    .last()
    .value().id;

  const newEvent = {
    id: lastId + 1,
    name: 'New event',
    description: 'Add some details',
    date: moment(),
    portfolio: 'social'
  };

  db
    .get('events')
    .push(newEvent)
    .write();

  res.redirect(`/events/${newEvent.id}/edit`);
});

router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .find({ id: id })
    .value();

  res.render('details', { event: event });
});

router.get('/:id/edit', function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .find({ id: id })
    .value();

  res.render('edit', {
    event: event,
    dateValue: moment(event.date).format('YYYY-MM-DD'),
    timeValue: moment(event.date).format('HH:mm')
  });
});

router.post('/:id/edit', function(req, res, next) {
  const id = parseInt(req.params.id, 10);
  const event = {
    id: id,
    name: req.body.name,
    description: req.body.description,
    date: moment(req.body.date + ' ' + req.body.time),
    portfolio: req.body.portfolio
  };
  console.log(event);
  db
    .get('events')
    .find({ id: id })
    .assign(event)
    .write();

  res.status(200);
  res.send('Successfully edited');
});

module.exports = router;