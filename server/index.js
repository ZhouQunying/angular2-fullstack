'use strict';

// Set default node enviroment to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    require('babel-core/register');
}

exports = module.exports = require('./app');
