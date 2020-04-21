# Real Time Web - Chat demo

A small demo to demonstate sockets beyond the basic demo.

## Setup

### Development
Install and start the server with the following commands.

```
npm install
npm start
```

### Tech
The package `nodemon` is used to autorestart the application on changes, `esm` is used to be able to use ES Module syntax instead of `require`. The demo is based on the basic Socket.io demo, so the `socket.io` package is used to handle all socket logic.

## Data lifecycle diagram
> Insert your diagram

## Message types
There are multiple message types to organise all messages that flow through the sockets. This provides a helpful structure during development.

### Client
- `set user` - Set your username
- `chat message` - Send a chat message to other people in the chat

### Server
- `server message` - Send a server notification to clients

## Credits
- [Razpudding](https://github.com/Razpudding) - For thinking along
- [Socket.io](https://socket.io/) - For the basic tutorial & their fantastic library

## License
See the LICENSE file in the root of this repository.
