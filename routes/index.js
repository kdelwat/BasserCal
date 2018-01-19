var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../persistence/db');

const getWeekEvents = () => {
  const startDate = moment();

  let events = [];
  for (let i = 0; i <= 6; i++) {
    const day = {
      date: startDate.clone().add(i, 'days')
    };

    day.events = db
      .getState()
      .events.filter(event => moment(event.date).isSame(day.date, 'day'));

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

module.exports = router;
