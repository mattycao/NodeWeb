var express = require('express');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');

var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(cookieParser('fhsdjkhfjfhsjkdhfjshdjfhjskdfhjksdhfjks'));

function checkLogin (req, res, next) {
  if (req.signedCookies && req.signedCookies.username) return next();
  res.redirect('/');
}

app.get('/', function (req, res, next) {
  res.render('index.ejs');
});

app.get('/user', checkLogin, function (req, res, next) {
  res.locals.username = req.signedCookies.username;
  res.render('user.ejs');
});

app.get('/login', function (req, res, next) {
  res.cookie('username', req.query.username, {
    maxAge: 120000,
    httpOnly: true,
    signed: true
  });
  res.redirect('/user');
});

app.get('/logout', function (req, res, next) {
  res.clearCookie('username');
  res.redirect('/');
});

app.listen(3001);
