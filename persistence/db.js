var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var moment = require('moment-timezone');

const adapter = new FileSync('db.json');
const db = low(adapter);

db
  .defaults({
    users: [{ name: 'cadel', password: 'password1' }],
    events: [
      {
        id: 1,
        name: 'Bar chase',
        date: moment.tz('2018-01-22', 'Australia/Sydney'),
        portfolio: 'social',
        description: 'A nice event'
      },
      {
        id: 2,
        name: 'Mr. Burns play',
        date: moment.tz('2018-01-22', 'Australia/Sydney'),
        portfolio: 'cultural',
        description: 'A nicer event'
      },
      {
        id: 3,
        name: 'Clean up Australia Day',
        date: moment.tz('2018-01-21', 'Australia/Sydney'),
        portfolio: 'communities',
        description: 'A nicest event'
      },
      {
        id: 4,
        name: 'MI6 Party',
        date: moment.tz('2018-01-20', 'Australia/Sydney'),
        portfolio: 'social',
        description: 'A nicererer event'
      }
    ]
  })
  .write();

module.exports = db;
