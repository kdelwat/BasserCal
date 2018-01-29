var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var moment = require('moment-timezone');
var passwordHash = require('password-hash');

const adapter = new FileSync('db.json');
const db = low(adapter);

db
  .defaults({
    users: [{ name: 'test', password: passwordHash.generate('password1') }],
    events: []
  })
  .write();

module.exports = db;
