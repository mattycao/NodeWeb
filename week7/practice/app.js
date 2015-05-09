/**
 * Created by caoyangkaka on 5/9/15.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var serveStatic = require('serve-static');

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(serveStatic(path.resolve(__dirname, 'assets')));

app.get('/login', function(req, res, next) {
    res.render('login');
});

app.listen(3001);