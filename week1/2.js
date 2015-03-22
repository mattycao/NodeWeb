/**
 * Created by caoyangkaka on 3/14/15.
 */


var http = require('http');

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

var server = http.createServer(function(req, res) {
    function send(html) {
        res.writeHead(200, {
            'content-type':'text/html; charset=utf-8'
        });
        res.end(html);
    }

    switch(req.url) {
        case '/':
            send('<ul>' +
                  '<li><a href="/item?cat=1&id=1">Article One</a></li>' +
                  '<li><a href="/item?cat=1&id=2">Article Two</a></li>' +
                  '<li><a href="/item?cat=1&id=3">Article Three</a></li>' +
                  '<li><a href="/item?cat=1&id=4">Article Four</a></li>' +
                  '<li><a href="/item?cat=1&id=5">Article Five</a></li>') +
                  '</u>';
            break;
        case '/item?cat=1&id=1':
            send(getNew(1));
            break;
        case '/item?cat=1&id=2':
            send(getNew(2));
            break;
        case '/item?cat=1&id=3':
            send(getNew(3));
            break;
        case '/item?cat=1&id=4':
            send(getNew(4));
            break;
        case '/item?cat=1&id=5':
            send(getNew(5));
            break;
        default:
            send('<h1>Page cannot be found.</h1>');
    }
}).listen(3001);
