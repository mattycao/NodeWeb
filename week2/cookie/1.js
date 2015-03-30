/**
 * Created by caoyangkaka on 3/28/15.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

app.get('/read', function(req, res, next) {
    res.json(req.cookies);
});

app.get('/write', function(req, res, next) {
    res.cookie('my_cookie', '123456');
    res.json(req.cookies);
});

app.listen(3001);