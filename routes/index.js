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

// Show homepage (the week view)
router.get('/', function(req, res, next) {
  const events = getWeekEvents();
  res.render('index', { events: events });
});

// Show login page.
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

// Authenticate login requests.
router.post(
  '/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
  })
);

// Redirect to the calendar for the current month.
router.get('/calendar', function(req, res, next) {
  const currentMonth =
    moment()
      .tz('Australia/Sydney')
      .month() + 1;
  res.redirect('/calendar/' + currentMonth);
});

const getFirstDayOfMonth = month => {
  var firstString;
  if (month < 10) {
    firstString = `2018-0${month}-01`;
  } else {
    firstString = `2018-${month}-01`;
  }

  return moment.tz(firstString, 'Australia/Sydney');
};

// Show the calendar view for a month.
router.get('/calendar/:month', function(req, res, next) {
  const month = parseInt(req.params.month, 10);

  const firstOfMonth = getFirstDayOfMonth(month);

  // Get day of week that the month starts on.
  const startDay = firstOfMonth.day();

  // Calculate the number of days needed to fill the month.
  var noDays = startDay + monthLengths[req.params.month];
  if (noDays % 7 !== 0) {
    noDays += Math.floor(noDays / 7 + 1) * 7 - noDays;
  }

  // Set the start date to the Sunday before the month begins.
  var startDate = firstOfMonth.clone().subtract(startDay, 'days');

  // Populate days for the calendar.
  var days = [];
  for (var i = 0; i < noDays; i++) {
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

    // Add CSS classes to each event, depending on portfolio.
    for (var eventIndex = 0; eventIndex < day.events.length; eventIndex++) {
      day.events[eventIndex].class =
        portfolioClasses[day.events[eventIndex].portfolio];
    }

    // Grey out days that fall outside the current month.
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
    monthName: firstOfMonth.format('MMMM'),
    title: 'Calendar'
  });
});

// Generate the events for the upcoming week.
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

module.exports = router;
