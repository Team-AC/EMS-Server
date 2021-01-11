const express = require('express');
const getSocket = require('../helpers/getSocket');

const evAPI = express.Router();

module.exports = (io) => {
  evAPI.post('/generate/:interval', (req, res) => {
    const { interval } = req.params;
    const evParameters = req.query;
    
    const socket = getSocket(io);
  
    socket.emit("Generate Ev", interval, evParameters);

    res.sendStatus(200);
  
  });

  return evAPI;
}
