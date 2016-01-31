'use strict';

import express from 'express';

var app = express();
// app.use(cors());
// app.use(app.router);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.get('/main', function (req, res) {
    res.send({
        'name': 'My name is Lala.'
    });
});
app.listen(9099);