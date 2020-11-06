const express = require('express');
const murbAPI = express.Router();
const { murbPower } = require('../models/murb');


murbAPI.get('/', (req, res) => {
  const {startDate, endDate} = req.query;

  murbPower.find({
    TimeStamp: {
      $gte: startDate,
      $lte: endDate
    }
  }, (err, murbs) => {
    if (err) return console.error(err);

    if (murbs.length > 100) {
      res.status(404).send({error: "Requested more than a 100 points"});
    } else {
      res.send(murbs);
    }
    
  });
})

module.exports = murbAPI;