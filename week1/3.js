/**
 * Created by caoyangkaka on 3/15/15.
 */
/**
 * Created by caoyangkaka on 3/14/15.
 * revise the part by using the url function
 */


var http = require('http');
var url = require('url');

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

var server = http.createServer(function (req, res) {
    function send(html) {
        res.writeHead(200, {
            'content-type': 'text/html; charset=utf-8'
        });
        res.end(html);
    }

    var info = url.parse(req.url);
    console.log(info);
    if (info.pathname === '/') {

        send('<ul>' +
        '<li><a href="/item?cat=1&id=1">Article One</a></li>' +
        '<li><a href="/item?cat=1&id=2">Article Two</a></li>' +
        '<li><a href="/item?cat=1&id=3">Article Three</a></li>' +
        '<li><a href="/item?cat=1&id=4">Article Four</a></li>' +
        '<li><a href="/item?cat=1&id=5">Article Five</a></li>') +
        '</u>';
    } else if (info.pathname === '/item' && info.query.cat === '1') {
        send(getNew(info.query.id));
    } else {
        send('<h1>Page cannot be found.</h1>');
    }
}).listen(3001);
