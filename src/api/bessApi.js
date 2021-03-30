const express = require('express');
const getSocket = require('../helpers/getSocket');
const {energy} = require('../models/bess');
const getEnergy = require('../services/getEnergy');

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

    const { chargeAmount } = req.query;

    socket.emit("Bess Charge", chargeAmount, () => {
      res.sendStatus(200)
    })
  })

  bessApi.get('/energy', (req, res) => {
    getEnergy()
    .then(data => {
      res.send(data)
    })
  })

  bessApi.get('/', )

  return bessApi
}