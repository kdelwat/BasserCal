var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var db = require('./persistence/db');

var index = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'a secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/events', events);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// set up authentication
var LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(function(username, password, done) {
    const user = db
      .get('users')
      .find(user => user.name == username)
      .value();

    if (user === undefined) {
      return done(null, false, { message: "User doesn't exist" });
    }

    if (user.password !== password) {
      return done(null, false, { message: 'Password incorrect' });
    }

    return done(null, user);
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.name);
});

passport.deserializeUser(function(user, done) {
  done(
    null,
    db
      .get('users')
      .find(x => x.name === user)
      .value()
  );
});

module.exports = app;
