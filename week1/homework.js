/**
 * Created by caoyangkaka on 3/21/15.
 */
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var static = require('./lib/static_server');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use('/public', static({
        root:__dirname +'/public',
        defaultFile: 'index.css'

    }
))


/*
 * This is the homework solution.
 * 1) Using the path.resolve to resolve the absolute path of the file
 * 2) Using the relative to decide whether valid nor not.
 * 3) Using the fs.exists to determine whether the file exists.
 * 4) Using the stat.isDirectory to determine whether the path points to a dic.
 * 5) Using the mime module to decide the content-type.
 */
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
//END OF HOMEWORK

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