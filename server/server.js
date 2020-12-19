var express = require('express');
// const mongodb = require('./mongodb/connection.js');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// initialize mongo
// var db = mongodb;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set up logger
app.use(logger('dev'));

// set up routing and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// add static assets
app.use(express.static(path.join(__dirname, 'public')));

// add routs
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
