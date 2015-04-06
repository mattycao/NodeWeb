 var express = require('express');
var httpProxy = require('http-proxy');
var forwarded = require('forwarded');
var parseUrl = require('url').parse;


function proxyPass (host, target) {
  var targetHost = parseUrl(target).host;
  var proxy = httpProxy.createProxyServer();

  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('Host', targetHost);
    proxyReq.setHeader('X-Real-IP', forwarded(req));
  });

  proxy.on('proxyRes', function (proxyRes, req, res) {
    res.setHeader('X-Proxy-By', 'proxy example');
  });

  proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/html'
    });
    res.end('<h1>Something went wrong</h1><pre>' + err.stack + '</pre>');
  });

  function stripHostPort (host) {
    if (host) host = host.split(':')[0];
    return host;
  }

  return function (req, res, next) {
    if (stripHostPort(req.headers.host) === host) {
      console.log('proxypass %s %s', host, req.url);
      proxy.web(req, res, {
        target: target
      });
    } else {
      next();
    }
  };
}

var app = express();

app.use(proxyPass('1.local.ucdok.com', 'http://dataguru.cn/'));
app.use(proxyPass('2.local.ucdok.com', 'http://www.w3.org/Protocols/'));
app.use(proxyPass('3.local.ucdok.com', 'http://nodeapi.ucdok.com/'));

app.use(function (req, res, next) {
  res.end('invalid host');
});

app.listen(80);
console.log('Server running at http://127.0.0.1/');
