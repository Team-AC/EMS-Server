// Returns a socket from a server instance (io), with socket.io v2 syntax
module.exports = (io) => {
  const sockets = io.sockets.connected;
  return sockets[Object.keys(sockets)[0]];
}