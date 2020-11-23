const addMurbPower = require('../services/addMurbPower');

module.exports = (socket) => {
  socket.on("Old Murb Power", (data) => {
    addMurbPower(data);
  });

  socket.on("New Murb Power", (data) => {
    addMurbPower(data);
  });
}