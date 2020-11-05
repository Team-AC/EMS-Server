const express = require('express');
const murbAPI = express.Router();
const { murbPower } = require('../models/murb');


murbAPI.get('/', (req, res) => {
  murbPower.find((err, murbs) => {
    if (err) return console.error(err);
    res.send(murbs);
  });
})

module.exports = murbAPI;