const { subDays } = require('date-fns');
const express = require('express');
const getSocket = require('../helpers/getSocket');
const { evPower } = require('../models/ev');
const preAddEvPower = require('../services/preAddEvPower');
const removeAllEv = require('../services/removeAllEv');

const evAPI = express.Router();

module.exports = (io) => {
  evAPI.post('/generate/:interval', (req, res) => {
    const { interval } = req.params;
    const evParameters = req.query;
    
    const socket = getSocket(io);

    const amountOfDaysToSub = {
      "pastDay": 1,
      "pastWeek": 7,
      "pastMonth": 30,
      "pastYear": 365
    }

    evPower.estimatedDocumentCount()
    .then((count) => {
      if ((count == 0)) {
        
        socket.emit("Pre - Generate Ev Power", () => {
          const dateInterval = {
            start: subDays(new Date(), amountOfDaysToSub[interval]),
            end: new Date()
          }
          
          preAddEvPower(dateInterval, parseInt(evParameters.num_ev_level_2), parseInt(evParameters.num_ev_level_3))
          .then(() => {
            socket.emit("Generate Ev", interval, evParameters);
            res.sendStatus(200);
          })
          .catch((err) => {
            res.sendStatus(500)
            console.error(err)
          })
        });
      } else {
        res.status(400).send("Cannot generate data while there is still data in the database, send the delete request first")
      }
    });
  });

  evAPI.delete('/', (req, res) => {
    removeAllEv()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  }) 

  return evAPI;
}
