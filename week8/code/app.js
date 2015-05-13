/**
 * 启动文件
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var utils = require('./lib/utils');


var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
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
  res.locals.logoutCode = req.session.logoutCode;
  res.locals.utils = utils;
  next();
});


require('./init/routes')(app);


app.listen(3001);
