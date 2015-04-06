var express = require('express');
var parseUserAgent = require('user-agent-parser');

function userAgent (req, res, next) {
  req.userAgent = parseUserAgent(req.headers['user-agent'] || '');
  next();
}

var app = express();
app.use(userAgent);

app.get('/', function (req, res, next) {
  res.send(req.userAgent);
});

app.listen(3001);
console.log('Server running at http://127.0.0.1:3001/');
