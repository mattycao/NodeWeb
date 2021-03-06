/**
 * Created by caoyangkaka on 3/21/15.
 */
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var fs = require('fs');
var path = require('path');
var mime = require('mime');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use('/public', serveStatic(__dirname + '/public'))

function serveStatic(root) {
    return function (req, res, next) {
        var file = req.originalUrl.slice(req.baseUrl.length + 1);
        file = path.resolve(root, file);
        if ((path.relative(root, file)).charAt(0) == '.') {
            res.status(403).send('Forbidden');
        } else {
            fs.exists(file, function (exists) {
                if (exists) {
                    fs.stat(file, function (err, stat) {
                        var stream;
                        if (err) {
                            next();
                        }
                        if (stat.isDirectory()) {
                            res.render('home', {
                                list: getList()
                            });
                        } else {
                            var type = mime.lookup(file);
                            console.log(type);
                            res.set('Content-Type', type);
                            stream = fs.createReadStream(file);
                            stream.pipe(res);
                        }
                    });
                } else {
                    next();
                }
            });
        }
    };
}

function getList() {
    var list = [];
    for (var i = 0; i < 10; i++) {
        list.push(getNewById(i));
    }
    return list;
}

function getNewById(id) {
    return {
        id: id,
        title: 'This is ' + id + ' title',
        content: 'This is content ' + id
    }
};

app.get('/', function (req, res, next) {
    res.render('home', {
        list: getList()
    });
});

app.get('/item/:id', function (req, res, next) {
    res.render('item', {
        news: getNewById(req.params.id)
    });
});

app.listen(3001);