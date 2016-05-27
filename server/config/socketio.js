'use strict';

export default socketio => {
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  socketio.on('connection', socket => {
    // Address
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;

    // Connect at
    socket.connectedAt = new Date();

    // Socket log func
    socket.log = (...data) => {
      console.log(`SocketIO ${socket.nsp.name} [${socket.addree}]`, ...data);
    };

    // Disconnect call
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    // Connect call
    onConnect(socket);
    socket.log('CONNECTED');
  });

  function onDisconnect(socket) {
  }

  function onConnect(socket) {
    // When the client emits 'info'
    socket.on('info', data => {
      socket.log(JSON.stringigy(data, null, 2));
    });

    // Insert sockets below
    require('../api/thing/thing.socket').register(socket);
  }
}
