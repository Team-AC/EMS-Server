const express = require('express');
const getSocket = require('../helpers/getSocket');

const designApi = express.Router();

module.exports = (io) => {
  designApi.post('/finance', (req, res) => {
    const socket = getSocket(io);

    const financeParams = req.query;

    socket.emit("Generate Finance", financeParams, (data) => {
      res.send(data);
    })
  })

  return designApi
}