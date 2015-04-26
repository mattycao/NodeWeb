/**
 * Created by caoyangkaka on 4/26/15.
 */
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


app.get('/', function (req, res) {
    res.render('homework');
});


var onlineUsers = {};


io.on('connection', function (socket) {

    socket.emit('chat message', {from: '系统', content: '请问如何称呼？'});

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        if (!socket.name) {
            if (!msg) {
                socket.emit('chat message', {from: '系统', content: '无名氏，请问如何称呼？'});
            } else {
                socket.name = msg;
                io.emit('chat message', {from: '系统', content: '欢迎『' + socket.name + '』加入'});
                onlineUsers[socket.name] = socket;
            }
        } else {
            var s = msg.match(/^@(.+)\s(.*)/);
            if (s) {
                // 在这里判断收件的人
                var tos = s[1].split(' ');
                var privateMsg = s[2];
                var flag = false;
                for (var i = 0; i < tos.length; i++) {
                    var toSocket = onlineUsers[tos[i].replace('@', '')];
                    if (toSocket) {
                        // 添加了如果是本人则不给自己私信
                        if (toSocket != socket) {
                            // 添加了信息的type属性，方便前端特殊处理私信
                            toSocket.emit('chat message', {from: socket.name, content: privateMsg, type: 'private'});
                        }
                        // 添加了flag这样子处理多人发送时自己只发送给自己一次
                        if (!flag) {
                            flag = true;
                            socket.emit('chat message', {from: socket.name, content: privateMsg});
                        }
                    } else {
                        socket.emit('chat message', {from: '系统', content: '『' + tos[i].replace('@', '') + '』好像不在……'});
                    }
                }

            } else {
                io.emit('chat message', {from: socket.name, content: msg});
            }
        }
    });

});


http.listen(3001, function () {
    console.log('listening on *:3001');
});
