const { murbPower } = require('../models/murb');

module.exports = (socket) => {
  socket.on("Old Murb Power", (data) => {
    murbPower.create(data, (err) => {
      if (err) console.error(err);
    });
  });

  socket.on("New Murb Power", (data) => {
    murbPower.create(data, (err) => {
      if (err) console.error(err);
    });
  });
}