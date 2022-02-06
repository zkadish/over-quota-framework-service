var path = require('path');
require('dotenv').config();
var express = require('express');
const cors = require('cors');
const { initMongo } = require('./config/mongo/db');

var createError = require('http-errors');
const compression = require("compression")
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var templatesRouter = require('./routes/templates');
var templateOrderRouter = require('./routes/templateOrder');
var blocksRouter = require('./routes/blocks');
var elementsRouter = require('./routes/elements');
var battleCardsRouter = require('./routes/battleCards');
var talkTracksRouter = require('./routes/talkTracks');
var eventsRouter = require('./routes/events');

const db = initMongo();
var app = express();
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// cors is set for every route
app.use(cors())

// set up logger
app.use(logger('dev'));

// set up routing and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// add static assets
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

// remove the trialing slash from incoming routes
app.use((req, res, next) => {
	if (req.path.substr(-1) == '/' && req.path.length > 1) {
		const query = req.url.slice(req.path.length)
		res.redirect(301, req.path.slice(0, -1) + query)
	} else {
		next()
	}
});

// add api routs
app.use('/api/v1/frameworks', templatesRouter);
app.use('/api/v1/frameworks', templateOrderRouter);
app.use('/api/v1/frameworks', blocksRouter);
app.use('/api/v1/frameworks', elementsRouter);
app.use('/api/v1/frameworks', battleCardsRouter);
app.use('/api/v1/frameworks', talkTracksRouter);
app.use('/api/v1/frameworks', eventsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // res.status(err.status || 500);
  next(createError(404));
});

// let react-router handle all non api routes
app.use('/*', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.redirect('404.html');
  res.render('error');
  next('test next');
});

module.exports = app;
