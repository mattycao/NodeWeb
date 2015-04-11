/**
 * Created by caoyangkaka on 4/10/15.
 * Requirement:
 * 效果：
 * 当在浏览器输入 http://1.local.ucdok.com 时，页面显示『这里是app1』
 * 当在浏览器输入 http://2.local.ucdok.com 时，页面显示『我是app2』
 * 要求：
 * vhost(host, subApp) 中的参数host不需要加上端口号
 */
var express = require('express');

var app = express();

// vhost中间件，待实现
/**
 *
 * @param host: no port number is need here
 * @param subApp: the express router object
 */
function vhost (host, subApp) {
    return function(req, res, next) {
        var getHost = stripHostPort(req.headers.host);
        if(host === getHost) {
            //console.log('Host:' + host + ', getHost:' + getHost);
            app.use(subApp);
        }
        next();
    }
}

// get the host address only
function stripHostPort (host) {
    if (host) host = host.split(':')[0];
    return host;
}

// 定义app1
var subApp1 = express.Router();
subApp1.get('/', function (req, res, next) {
    res.end('This is the app1');
});
app.use(vhost('1.local.ucdok.com', subApp1));

// 定义app2
var subApp2 = express.Router();
subApp2.get('/', function (req, res, next) {
    res.end('This is the app2');
});
app.use(vhost('2.local.ucdok.com', subApp2));

app.listen(3001);