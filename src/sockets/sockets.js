const addMurbPower = require('../services/addMurbPower');
const addEvPower = require('../services/addEvPower');
const addBess = require('../services/addBess');
const addEnergy = require('../services/addEnergy');

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

  socket.on("Historical Data Pause", (timeStamp) => {
    schedule = {
      test: 0
    }
    setTimeout(() => {
      socket.emit("Historical Data Continue", (schedule))
    }, 100)
  })

  socket.on("New Energy", (data) => {
    addEnergy(data)
    .catch(err => console.log(err))
  })

  socket.on("Test", (data) => {
    console.log(`Received Test Event with: ${data}`);
  })
}