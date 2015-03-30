var express = require('express');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var uuid = require('uuid');
var clone = require('clone');


function session () {
  var data = {};
  return function (req, res, next) {
    // 检查是否有session_id，没有则随机生成一个
    var id = req.signedCookies.session_id || uuid.v4();
    // 设置session_id
    res.cookie('session_id', id, {
      maxAge: 600000,
      path: '/',
      httpOnly: true,
      signed: true
    });
    // 设置req.session
    req.session = clone(data[id] || {});
    // 请求处理完毕后，保存session数据
    res.on('finish', function () {
      console.log('save session', req.session);
      data[id] = clone(req.session);
    });
    // 传递到下一个中间件
    next();
  };
}


var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(cookieParser('fhsdjkhfjfhsjkdhfjshdjfhjskdfhjksdhfjks'));
app.use(session());

function checkLogin (req, res, next) {
  if (req.session && req.session.username) return next();
  res.redirect('/');
}

app.get('/', function (req, res, next) {
  res.render('index.ejs');
});

app.get('/user', checkLogin, function (req, res, next) {
  res.locals.username = req.session.username;
  res.render('user.ejs');
});

app.get('/login', function (req, res, next) {
  req.session.username = req.query.username;
  res.redirect('/user');
});

app.get('/logout', function (req, res, next) {
  delete req.session.username;
  res.redirect('/');
});

app.listen(3001);
