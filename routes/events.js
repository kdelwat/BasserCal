var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
var db = require('../persistence/db');
var passport = require('passport');
var authenticationMiddleware = require('connect-ensure-login');

var ensureLoggedIn = authenticationMiddleware.ensureLoggedIn;

const portfolioClasses = {
  social: 'is-primary',
  sport: 'is-warning',
  communities: 'is-danger',
  cultural: 'is-info'
};

// Create a new event in the database and redirect to the edit page for editing.
router.get('/new', ensureLoggedIn('/login'), function(req, res, next) {
  const last = db
    .get('events')
    .last()
    .value();

  var lastId;
  if (last !== undefined) {
    lastId = last.id;
  } else {
    lastId = 1;
  }

  const newEvent = {
    id: lastId + 1,
    name: 'New event',
    description: 'Add some details',
    date: moment().tz('Australia/Sydney'),
    portfolio: 'social'
  };

  db
    .get('events')
    .push(newEvent)
    .write();

  res.redirect(`/events/${newEvent.id}/edit`);
});

// Display event details.
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .find({ id: id })
    .value();

  event.class = portfolioClasses[event.portfolio];

  const date = moment.tz(event.date, 'Australia/Sydney');

  event.datestamp = date.format('dddd, MMMM Do');
  event.timestamp = date.format('h:mm a');
  event.delta = moment()
    .tz('Australia/Sydney')
    .to(date);

  res.render('details', { event: event, title: event.name });
});

// Show a delete confirmation page.
router.get('/:id/delete', ensureLoggedIn('/login'), function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .find({ id: id })
    .value();

  res.render('delete', {
    event: event,
    title: 'Delete event'
  });
});

// Delete the given event.
router.post('/:id/delete', ensureLoggedIn('/login'), function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .remove({ id: id })
    .write();

  res.redirect('/');
});

// Show the event edit page.
router.get('/:id/edit', ensureLoggedIn('/login'), function(req, res, next) {
  const id = parseInt(req.params.id, 10);

  const event = db
    .get('events')
    .find({ id: id })
    .value();

  res.render('edit', {
    event: event,
    dateValue: moment.tz(event.date, 'Australia/Sydney').format('YYYY-MM-DD'),
    timeValue: moment.tz(event.date, 'Australia/Sydney').format('HH:mm'),
    title: 'Edit event'
  });
});

// Edit event in database from form data.
router.post('/:id/edit', ensureLoggedIn('/login'), function(req, res, next) {
  const id = parseInt(req.params.id, 10);
  const event = {
    id: id,
    name: req.body.name,
    description: req.body.description,
    date: moment.tz(req.body.date + ' ' + req.body.time, 'Australia/Sydney'),
    portfolio: req.body.portfolio
  };
  db
    .get('events')
    .find({ id: id })
    .assign(event)
    .write();

  res.redirect(`/events/${id}/`);
});

module.exports = router;
