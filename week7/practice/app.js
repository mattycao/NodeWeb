/**
 * Created by caoyangkaka on 5/9/15.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var serveStatic = require('serve-static');

//require('./init/models');

var app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use('/assets', serveStatic(path.resolve(__dirname, 'assets')));

require('./init/routers')(app);



app.listen(3001);