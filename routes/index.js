var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
var db = require('../persistence/db');
var passport = require('passport');

const portfolioClasses = {
  social: 'is-primary',
  sport: 'is-warning',
  communities: 'is-danger',
  cultural: 'is-info'
};

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

    for (var eventIndex = 0; eventIndex < day.events.length; eventIndex++) {
      day.events[eventIndex].class =
        portfolioClasses[day.events[eventIndex].portfolio];
    }

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

const monthLengths = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
};

router.get('/calendar/:month', function(req, res, next) {
  var month = parseInt(req.params.month, 10);
  var firstString;
  if (month < 10) {
    firstString = `2018-0${req.params.month}-01`;
  } else {
    firstString = `2018-${req.params.month}-01`;
  }
  var firstOfMonth = moment.tz(firstString, 'Australia/Sydney');
  var startDay = firstOfMonth.day();
  var startDate = firstOfMonth.clone().subtract(startDay, 'days');

  var days = [];
  for (var i = 0; i < monthLengths[req.params.month] + 7; i++) {
    const day = {
      date: startDate.clone().add(i, 'days')
    };
    day.dayOfMonth = day.date.format('D');
    day.dayOfWeek = day.date.format('ddd');
    day.events = db
      .getState()
      .events.filter(event =>
        moment.tz(event.date, 'Australia/Sydney').isSame(day.date, 'day')
      );

    for (var eventIndex = 0; eventIndex < day.events.length; eventIndex++) {
      day.events[eventIndex].class =
        portfolioClasses[day.events[eventIndex].portfolio];
    }

    if (day.date.month() + 1 != month) {
      day.outsideMonth = true;
    } else {
      day.outsideMonth = false;
    }

    days.push(day);
  }

  var nextMonth = month < 12 ? month + 1 : month;
  var prevMonth = month > 1 ? month - 1 : month;
  res.render('calendar', {
    days: days,
    nextMonth: nextMonth,
    prevMonth: prevMonth,
    monthName: firstOfMonth.format('MMMM')
  });
});

module.exports = router;
