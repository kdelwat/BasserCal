var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
var db = require('../persistence/db');
var passport = require('passport');

const getWeekEvents = () => {
  const startDate = moment().tz('Australia/Sydney');

  let events = [];
  for (let i = 0; i <= 6; i++) {
    const day = {
      date: startDate.clone().add(i, 'days')
    };

    day.events = db
      .getState()
      .events.filter(event =>
        moment.tz(event.date, 'Australia/Sydney').isSame(day.date, 'day')
      );

    day.dayOfMonth = day.date.format('D');
    day.dayOfWeek = day.date.format('ddd');
    events.push(day);
  }

  return events;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  const events = getWeekEvents();
  console.log(events);
  res.render('index', { events: events });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/calendar', function(req, res, next) {
  res.render('calendar');
});

module.exports = router;
