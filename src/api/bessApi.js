const express = require('express');
const getSocket = require('../helpers/getSocket');

const bessApi = express.Router();

module.exports = (io) => {
  bessApi.post('/init', (req, res) => {
    const socket = getSocket(io);

    const bessParams = req.body;

    socket.emit("Bess Init", bessParams, () => {
      res.sendStatus(200)
    })
  })

  bessApi.post('/charge', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Bess Charge", () => {
      res.sendStatus(200)
    })
  })

  return bessApi
}