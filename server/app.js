'use strict';

import express from 'express';
import mongoose from 'mongoose';
import http from 'http';

import config from './config/environment';

mongoose.Promise = require('bluebird');

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server
const app = express();
const server = http.createServer(app);
require('./config/express').default(app);
require('./routes').default(app);

setImmediate(startServer);

function startServer() {
  app.lala = server.listen(config.port, config.ip, () => {
    console.log(`Express server listening on ${config.port}, in ${app.get('env')}`);
  });
}

export default app;
