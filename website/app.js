var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;
var multer = require('multer');
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
//var enforce = require('express-sslify');
var db = mongoose.connection;
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var fs = require('fs-extra');
var cloudconvert = new (require('cloudconvert'))('API_KEY');
var cryptojs = require('crypto-js');
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './templates');
  },
  filename: function (req, file, callback) {
    callback(null, cryptojs.SHA3(Math.random() + file.fieldname + '-' + Date.now()));
  }
});
var upload = multer({ storage : storage}).single('userTemplate');


// Sets the path to route directories
var routes = require('./routes/index');
var users = require('./routes/users');

// Express is the Node.js framework for web apps
var app = express();

//app.use(enforce.HTTPS());

// View engine set-up: using Jade files located in /views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware for parsers handling cookies
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle Sessions - Keeps track of user details until they leave the website
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport - Authenticates users
app.use(passport.initialize());
app.use(passport.session());

// Validator - Checks forms for valid inputs
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Sets the routes for URLs
app.use('/', routes);
app.use('/users', users);

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

/*
app.use(function(req, res, next) {
  if ((req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url);
  } else
    next();
});
*/