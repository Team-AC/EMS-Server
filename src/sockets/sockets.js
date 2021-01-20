const addMurbPower = require('../services/addMurbPower');
const addEvPower = require('../services/addEvPower');

module.exports = (socket) => {
  socket.on("Old Murb Power", (data) => {
    addMurbPower(data);
  });

  socket.on("New Murb Power", (data) => {
    addMurbPower(data);
  });

  socket.on("New EV Power", (data) => {
    addEvPower(data)
    .catch(err => console.log(err))
  });

  socket.on("Test", (data) => {
    console.log(`Received Test Event with: ${data}`);
  })
}