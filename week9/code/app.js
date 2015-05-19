/**
 * 启动文件
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var i18n = require('i18n');
var cache = require('./init/cache');
var models = require('./init/models');
var RedisStore = require('connect-redis')(session);
var utils = require('./lib/utils');


i18n.configure({
  locales: ['fr', 'zh-cn'],
  defaultLocale: 'zh-cn',
  cookie: 'lang',
  directory: __dirname + '/locales'
});

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
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
app.use(i18n.init);
app.use(function (req, res, next) {
  var host = (req.headers.host || '').split(':')[0];
  cache.get('host_' + host, function (name, callback) {
    models.get('user').findOne({domain_name: host}, function (err, user) {
      if (!user) {
        user = {};
      }
      callback(null, user);
    });
  }, function (err, user) {
    if (err) return next(err);
    req.blogInfo = {
      domain: host,
      theme: user.theme || 'default',
      user: user.name || ''
    };
    next();
  });
});
app.use(function (req, res, next) {
  res.locals.loginName = req.session.loginName;
  res.locals.logoutCode = req.session.logoutCode;
  res.locals.utils = utils;
  res.__render = res.render;
  res.render = function (name) {
    name = req.blogInfo.theme + '/' + name;
    var args = Array.prototype.slice.call(arguments);
    args[0] = name;
    res.__render.apply(res, args);
  };
  next();
});


require('./init/routes')(app);


app.listen(3001);
