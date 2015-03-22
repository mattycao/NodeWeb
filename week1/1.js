/**
 * Created by caoyangkaka on 3/14/15.
 */
var http = require('http');
//http.createServer(function (req, res) {
//    console.log(req.method + ':' + req.url);
//    console.log(req.headers);
//    res.end('Hello world!');
//   notice we can listen on the request event
var server = http.createServer();
server.on('request',function(req, res) {
    console.log(req.method + ':' + req.url);
    console.log(req.headers);
    //res.statusCode = 404;
    res.writeHead(404, {
        'abc': '1234'
    });
    //res.setHeader('abcd', 123);
    res.end('Hello, world!');
}).listen(3001);

//