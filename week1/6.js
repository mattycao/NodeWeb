/**
 * Created by caoyangkaka on 3/21/15.
 */
var express = require('express');

var app = express();

app.get('/news', function(req, res, next) {
    res.json(req.query);
});

app.get('/item/:id', function(req, res, next) {
    res.json(req.params);
});

app.listen(3001);