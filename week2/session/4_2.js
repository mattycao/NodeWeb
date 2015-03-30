var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var session = require('express-session');
var MyStore = require('./my_store')(session);


var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(cookieParser('fhsdjkhfjfhsjkdhfjshdjfhjskdfhjksdhfjks'));
app.use(session({
  secret: 'your secret key',
  store: new MyStore(path.resolve(__dirname, 'session'))
}));

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
