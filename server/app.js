'use strict';

import express from 'express';

var app = express();

app.get('/main', function (req, res) {
    res.send({
        'name': 'Lala'
    });
});
app.listen(9099);