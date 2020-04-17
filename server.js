import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const ioInstance = socketIO(server);

let id = 0;
const eventList = [];

// self-invoking event loop
function generateEvent() {
  const newEvent = {
    id: id++,
    room: Math.round(Math.random() * 4),
    timestamp: new Date(),
    value: Math.round(Math.random() * 1000)
  }

  ioInstance.emit('event occured', newEvent);
  eventList.push(newEvent);

  setTimeout(generateEvent, Math.random() * 1000);
}

// trigger loop
generateEvent();

// return collection of events
app.get('/', function(req, res) {
  res.json(eventList.reverse());
  eventList.length = 0;
});

ioInstance.on('connection', function(socket) {
  console.log(`socket ${socket.id} created`);

  socket.emit('server message', `SERVER: Welcome to the void.`);

  socket.on('disconnect', function(){
    console.log(`socket ${socket.id} closed`);
  });
})

server.listen(3001, function() {
  console.log('listening on *:3001');
});