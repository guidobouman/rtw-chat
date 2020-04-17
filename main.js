import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import ioClient from 'socket.io-client';

const app = express();
const server = http.createServer(app);
const ioInstance = ioServer(server);

const historyLenght = 100;
let lastAverage = 0;
let eventLog = [];

const externalData = ioClient('http://localhost:3001');
externalData.on('event occured', function(event) {
  eventLog.push(event);
  eventLog = eventLog.slice(eventLog.length - historyLenght);

  const total = eventLog.reduce((total, current) => {
    return total + current.value;
  }, 0);
  const average = total / eventLog.length;

  if(lastAverage < 500 && average > 500) {
    console.log('now positive');
    ioInstance.emit('server message', `SERVER: the trend has changed and is now positive`);
  }
  if(lastAverage > 500 && average < 500) {
    console.log('now negative');
    ioInstance.emit('server message', `SERVER: the trend has changed and is now negative`);
  }

  // ioInstance.emit('server message', `SERVER: the trend has changed ${average > 500 ? 'positive' : 'negative'}`);

  // ioInstance.emit('average', `SERVER: the average right now is ${average > 500 ? 'positive' : 'negative'}`);
  // ioInstance.emit('trend direction', `SERVER: the trend right now is going ${average > lastAverage ? 'up' : 'down'}`);

  lastAverage = average;
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

ioInstance.on('connection', function(socket) {
  console.log('socket created');

  let userName = 'anonymous';
  socket.emit('server message', `SERVER: Welcome to the void.`);
  socket.broadcast.emit('server message', `SERVER: User ${userName} connected.`);

  socket.on('set user', function(id) {
    const oldUsername = userName;
    userName = id;
    console.log(`user with id ${userName} connected`);
    socket.emit('server message', `SERVER: Your username was changed to ${userName}.`);
    socket.broadcast.emit('server message', `SERVER: User ${oldUsername} changed their name to ${userName}.`);
  });

  socket.on('disconnect', function(){
    console.log(`user with id ${userName} disconnected`);
    ioInstance.emit('server message', `SERVER: User with id ${userName} disconnected.`);
  });

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    ioInstance.emit('chat message', `${userName}: ${msg}`);
  });
})

server.listen(3000, function() {
  console.log('listening on *:3000');
});