'use strict';

import express from 'express';

var app = express();

app.get('/', function (req, res) {
    res.send('Hesdfllo');
});
app.listen(9000);