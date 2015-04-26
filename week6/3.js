var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookie = require('cookie');


io.use(function(socket, next){
  var cookies = cookie.parse(socket.request.headers.cookie || '');
  if (cookies.nickname) {
    socket.name = cookies.nickname;
    next();
  } else {
    next(new Error('认证失败'));
  }
});


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


app.get('/', function (req, res) {
  if (req.query.nickname) {
    res.cookie('nickname', req.query.nickname);
    res.redirect('/chat');
  } else {
    res.render('login');
  }
});

app.get('/chat', function (req, res) {
  res.render('index2');
});


var onlineUsers = {};


io.on('connection', function (socket) {

  io.emit('chat message', {from: '系统', content: '欢迎『' + socket.name + '』加入'});
  onlineUsers[socket.name] = socket;

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
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
  });

});


http.listen(3001, function () {
  console.log('listening on *:3001');
});
