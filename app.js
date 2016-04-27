var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var FileStreamRotator = require('file-stream-rotator')
var fs = require('fs')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var router = require('./routes/router');
var app = express();

//Config
config(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Logger
var logDir = __dirname + '/log';
fs.existsSync(logDir) || fs.mkdirSync(logDir);
var accessLogStream = FileStreamRotator.getStream({
  date_formate: 'YYYYMMDD',
  filename: logDir + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})
logger.token('reqBody', function(req, res){
  return JSON.stringify(req.body);
});
app.use(logger(':date[iso] :remote-addr - :url :method :reqBody', {stream: accessLogStream}));
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route
router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (req.accepts('html') == 'html')
    {
      res.render('error', {
        message: err.message,
        error: err
      });
    }else
    if (req.accepts('json') ==  'json') {
      res.formatOutput(err.status, err.message, null);
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (req.accepts('html') == 'html')
  {
    res.render('error', {
      message: err.message,
      error: err
    });
  }else
  if (req.accepts('json') ==  'json') {
    res.formatOutput(err.status, err.message, null);
  }
});

module.exports = app;