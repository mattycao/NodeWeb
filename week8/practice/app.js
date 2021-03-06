/**
 * Created by caoyangkaka on 5/9/15.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var hbs = require('hbs');
//require('./init/models');

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '/views/partials'); // access the partial files in the partials folder
app.use('/assets', serveStatic(path.resolve(__dirname, 'assets')));

app.use(cookieParser('your secret key'));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'your secret key',
    store: new RedisStore({
        port: 6379,
        host: '127.0.0.1'
    })
}));

app.use(function (req, res, next) {
    res.locals.loginName = req.session.loginName || '';
    res.locals.logoutCode = req.session.logoutCode;
    next();
});

require('./init/routers')(app);



app.listen(3001);