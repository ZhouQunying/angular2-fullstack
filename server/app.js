'use strcit';

import express from 'express';
import mongoose from 'mongoose';
import http from 'http'
import config from './config/environment';
mongoose.Promise = require('bluebird');

// Connect to MongoDB
mongoose.connection(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

if (config.seeDB) {
  require('./config/seed');
}

// Setup server
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io')(server, {
  serverClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
