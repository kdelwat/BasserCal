var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var moment = require('moment');

const adapter = new FileSync('db.json');
const db = low(adapter);

db
  .defaults({
    users: [{ name: 'cadel', password: 'password1' }],
    events: [
      {
        id: 1,
        name: 'Bar chase',
        date: moment('2018-01-22'),
        portfolio: 'social',
        description: 'A nice event'
      },
      {
        id: 2,
        name: 'Mr. Burns play',
        date: moment('2018-01-22'),
        portfolio: 'cultural',
        description: 'A nicer event'
      },
      {
        id: 3,
        name: 'Clean up Australia Day',
        date: moment('2018-01-21'),
        portfolio: 'communities',
        description: 'A nicest event'
      },
      {
        id: 4,
        name: 'MI6 Party',
        date: moment('2018-01-20'),
        portfolio: 'social',
        description: 'A nicererer event'
      }
    ]
  })
  .write();

module.exports = db;
