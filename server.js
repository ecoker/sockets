/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const isDeveloping = process.env.NODE_ENV !== 'production';
const config = isDeveloping ? require('./webpack.config.js') : require('./webpack.production.config.js');
const port = isDeveloping ? 3000 : (process.env.PORT || 80);
const app = express();

/* Jade */
app.set('view engine', 'jade');

/* STYLES */
app.use('/styles', express.static(__dirname + '/dist/styles'));

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  webpack(config, function(err,stats){
    if (err) return err;
  });
  app.use('/scripts', express.static(__dirname + '/dist/scripts'));
}

/* ROUTES */
app.get('/', function(req, res) {
  res.render('index');
});

/* ADD WEBSOCKETS */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var iomiddleware = require('socketio-wildcard')();

io.use(iomiddleware);

var connectedUsers = {};

var socketHandler = function(name, payload, socket, io) {
  switch(name) {
    case 'name':
      connectedUsers[socket.id] = {
        name: payload
      };
      io.emit('users', connectedUsers);
      socket.emit('name', payload);
      break;
    case 'public':
      io.emit('public', payload);
      break;
    case 'private':
      io.to(payload.socketId).emit('private', payload.message);
      break;
    case 'self':
      socket.emit('self', payload);
      break;
    case 'room':
      io.in(payload.room).emit('room', payload);
      break;
    case 'change-room':
      socket.leave(payload.leave);
      socket.join(payload.join);
      socket.emit('change-room', payload.join);
      io.in(payload.join).emit('room', {
        message: `${connectedUsers[socket.id].name} joined the room`
      });
      break;
    default:
      console.log('no handler');
  }
}

io.on('connection', function(socket) {
  io.emit('users', connectedUsers);
  socket.on('*', function(event){
    socketHandler(event.data[0], event.data[1], socket, io);
  });
  socket.on('disconnect', function() {
    if (connectedUsers[socket.id]) {
      delete connectedUsers[socket.id];
      io.emit('users', connectedUsers);
    }
  });
});

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s in your browser.', port, port);
});

/*

// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');

*/
