// Returns a socket from a server instance (io), with socket.io v2 syntax
module.exports = (io) => {
  const sockets = io.sockets.connected;

  const socket = sockets[Object.keys(sockets)[0]];

  if (!socket) throw 'No Client connected to socket, make sure the python simulation is running';
  
  return socket;
}