// Returns a socket from a server instance (io), with socket.io v2 syntax
module.exports = (io) => {
  const sockets = io.of("/").sockets;

  const socket = sockets.values().next().value;

  if (!socket) throw 'No Client connected to socket, make sure the python simulation is running';
  
  return socket;
}