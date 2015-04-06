var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');
var parseUrl = require('url').parse;


function stripHostPort (host) {
  if (host) host = host.split(':')[0];
  return host;
}

function getHostName (url) {
  return stripHostPort(parseUrl(url).host);
}

function checkReferer (whiteList)  {
  return function (req, res, next) {
    var referer = req.headers.referer || req.headers.referrer;
    // 如果没有Referer，则直接跳过
    if (!referer) return next();
    var refererHost = getHostName(referer);
    // 如果与当前域名相同则跳过
    if (refererHost === stripHostPort(req.headers.host)) return next();
    // 如果存在于白名单中则跳过
    if (whiteList.indexOf(refererHost) !== -1) return next();
    // host不同，返回出错信息
    res.sendFile(path.resolve(__dirname, 'wrong_referer.png'));
  };
}


var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use('/img', checkReferer(['127.0.0.1', 'a.local.ucdok.com', 'b.local.ucdok.com']));
app.use('/img', serveStatic(__dirname + '/img'));

app.get('/', function (req, res, next) {
  res.render('img');
});

app.listen(3001);
