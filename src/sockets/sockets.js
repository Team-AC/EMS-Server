const addMurbPower = require('../services/addMurbPower');
const addEvPower = require('../services/addEvPower');
const addBess = require('../services/addBess');

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

  socket.on("New Bess", (data) => {
    addBess(data)
    .catch(err => console.log(err))
  });


  socket.on("Test", (data) => {
    console.log(`Received Test Event with: ${data}`);
  })
}