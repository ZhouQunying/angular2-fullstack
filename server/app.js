/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import config from './config/environment';
import http from 'http';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

// Populate databases with sample date
if (config.seedDB) {
    require('./config/seed');
}

var app = express();
// app.use(cors());
// app.use(app.router);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

app.set('views', '../client')
app.set('view engine', 'jade');

app.get('/main', (req, res) => {
    res.send({
        'name': 'My name is lala.'
    })
});

app.listen(9000);

process.on('exit', () => {
    process.exit(1);
});
