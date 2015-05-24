/**
 * Created by caoyangkaka on 5/12/15.
 */
// for the require module
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

// for the mime type
var mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css'
};

// create server
http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), decodeURI(uri));
    console.log('loading ' + uri);
    var stats;
    try {
        stats = fs.lstatSync(fileName);
    } catch(e) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not found\n');
        res.end();
        return;
    }
    // check if file/directory
    if(stats.isFile()) {
        var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType});
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if(stats.isDirectory()) {
        res.writeHead(302, {
            'location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('500 Internal Error');
    }
}).listen(3001);