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

//require('./init/models');

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use('/assets', serveStatic(path.resolve(__dirname, 'assets')));

app.use(cookieParser('your secret key'));
app.use(session({
    secret: 'your secret key',
    store: new RedisStore({
        port: 6379,
        host: '127.0.0.1'
    })
}));

app.use(function (req, res, next) {
    res.locals.loginName = req.session.loginName;
    next();
});

require('./init/routers')(app);



app.listen(3001);