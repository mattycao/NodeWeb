var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


app.get('/', function (req, res) {
  res.render('index');
});


io.on('connection', function (socket) {
  console.log('a user connected');

  socket.emit('chat message', '欢迎光临！');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    socket.broadcast.emit('chat message', '自己不能收到 ' + msg);
  });

});


http.listen(3001, function () {
  console.log('listening on *:3001');
});
