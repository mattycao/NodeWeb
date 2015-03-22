/**
 * Created by caoyangkaka on 3/18/15.
 * revised version of 3,js by using the connect instead.
 */
var http = require('http');
var url = require('url');
var connect = require('connect');


function getNew(id) {
    var data = {
        1: 'This is article 1.',
        2: 'This is article 2.',
        3: 'This is article 3.',
        4: 'This is article 4.',
        5: 'This is article 5.'
    };
    return data[id] || 'No article here.';
}

var app = connect();
app.use(function(req, res, next) {
    res.send = function sendHTML(html) {
        res.writeHead(200, {
            'content-type': 'text/html; charset=utf-8'
        });
        res.end(html);
    };
    next();
});

app.use(function(req, res, next) {
    var info = url.parse(req.url, true);
    req.pathname = info.pathname;
    req.query = info.query;
    next();
});

app.use(function(req, res, next) {
    if (req.pathname === '/') {

        res.send('<ul>' +
        '<li><a href="/item?cat=1&id=1">Article One</a></li>' +
        '<li><a href="/item?cat=1&id=2">Article Two</a></li>' +
        '<li><a href="/item?cat=1&id=3">Article Three</a></li>' +
        '<li><a href="/item?cat=1&id=4">Article Four</a></li>' +
        '<li><a href="/item?cat=1&id=5">Article Five(LA)</a></li>') +
        '</u>';
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    if (req.pathname === '/item' && req.query.cat === '1') {
        res.send(getNew(req.query.id));
    } else {
        next();
    }
});

app.use(function(req, res, next) {
    res.send('<h1>Page cannot be found.</h1>');
});

var server = http.createServer(app).listen(3001);
