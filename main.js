import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const ioInstance = socketIO(server);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

ioInstance.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    ioInstance.emit('chat message', msg);
  });
})

server.listen(3000, function() {
  console.log('listening on *:3000');
});