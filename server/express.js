'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
    policies = require('./config/policies'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    path = require('path'),
    passport = require('passport'),
    routes = require('./routes/routes');


/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);
  // Enable jsonp
  app.enable('jsonp callback');
  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  app.use(favicon(config.favicon));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set swig as the template engine
  app.set('view engine', 'jade');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'I am a secret',
    key: 'myKey',

    //should be a database store - or will leak memory
    /*store: new MongoStore({
      mongooseConnection: ...
      collection: ...
    })*/
  }));
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};



/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }
    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};


/**
 * Initialize the Express application
 */
module.exports.init = function () {
  // Initialize express app

  var app = express();

  // Initialize Express view engine
  this.initViewEngine(app);
  
  // Initialize Helmet security headers
  this.initHelmetHeaders(app);


  // Initialize Express session
  this.initSession(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  policies.invokeRolesPolicies();

  routes.init(app);

  return app;
};
