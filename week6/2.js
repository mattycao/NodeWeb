var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


app.get('/', function (req, res) {
    res.render('index2');
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
                var to = s[1];
                var privateMsg = s[2];
                var toSocket = onlineUsers[to];
                if (toSocket) {
                    toSocket.emit('chat message', {from: socket.name, content: privateMsg});
                    socket.emit('chat message', {from: socket.name, content: privateMsg});
                } else {
                    socket.emit('chat message', {from: '系统', content: '『' + to + '』好像不在……'});
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
