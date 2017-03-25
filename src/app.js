import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import bluebird from 'bluebird';

import config from './config/environment';

mongoose.Promise = bluebird;

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', (err) => {
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
const startServer = () => {
  app.sparkme = server.listen(config.port, config.ip, () => {
    console.log(`Express server listening on ${config.port}, in ${app.get('env')}`);
  });
};

require('./express').default(app);

require('./routes').default(app);

setImmediate(startServer);

export default app;
