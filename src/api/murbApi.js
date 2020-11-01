const express = require('express');
const murbAPI = express.Router();
const { murb } = require('../models');


murbAPI.get('/', (req, res) => {
  murb.find((err, murbs) => {
    if (err) return console.error(err);
    res.send(murbs);
  });
})

module.exports = murbAPI;