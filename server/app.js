'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
  express = require('./express'),
  chalk = require('chalk');

var app = express.init();

module.exports.start = function start(callback) {

  app.listen(config.port, config.host, function () {
    // Create server URL
    var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
    // Logging initialization
    console.log('--');
    console.log(chalk.green('Backbon node experiment'));
    console.log();
    console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
    console.log(chalk.green('Server:          ' + server));

    console.log('--');

    if (callback) callback(app, config);
  });


};
