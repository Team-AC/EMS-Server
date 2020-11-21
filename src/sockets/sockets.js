const addMurbPower = require('../services/addMurbPower');

module.exports = (socket) => {
  socket.on("Old Murb Power", (data) => {
    addMurbPower(data)
    .then(() => socket.emit('Old Murb Power Next'));
  });

  socket.on("New Murb Power", (data) => {
    addMurbPower(data);
  });
}