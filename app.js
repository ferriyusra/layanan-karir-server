var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const announcementRouter = require('./app/announcement/router');
const categoryRouter = require('./app/category/router');

const companyRouter = require('./app/company/router');
const industryRouter = require('./app/industry/router');
const jobRouter = require('./app/job/router');
const jobSkillRouter = require('./app/jobskill/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', announcementRouter);
app.use('/api', categoryRouter);

app.use('/api', companyRouter);
app.use('/api', industryRouter);
app.use('/api', jobRouter);
app.use('/api', jobSkillRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
