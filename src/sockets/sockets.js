const { murbPower } = require('../models/murb');

module.exports = (socket) => {
  socket.on("Old Murb Power", (data) => {
    murbPower.create(data, (err) => {
      console.error(err);
    });
  })
}