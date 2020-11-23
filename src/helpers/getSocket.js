module.exports = (io) => {
  const sockets = io.sockets.connected;
  return sockets[Object.keys(sockets)[0]];
}