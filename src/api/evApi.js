const { subDays } = require('date-fns');
const express = require('express');
const getCostFromPower = require('../helpers/getCostFromPower');
const getOffPeakUsage = require('../helpers/getOffPeakUsage');
const getPeakUsage = require('../helpers/getPeakUsage');
const getSocket = require('../helpers/getSocket');
const { evPower, evPowerDaily, evPowerWeekly, evPowerMonthly, evConfig } = require('../models/ev');
const addEvConfig = require('../services/addEvConfig');
const getNewSchedule = require('../services/getNewSchedule');
const getEvData = require('../services/getEvData');
const preAddEvPower = require('../services/preAddEvPower');
const removeAllBess = require('../services/removeAllBess');
const removeAllEv = require('../services/removeAllEv');

const evAPI = express.Router();

function validateInterval(req, res, next) {
  const { interval } = req.params;
  const possibleValues = [
    "pastDay",
    "pastWeek",
    "pastMonth",
    "past3Months",
    "pastYear"
  ];

  if (possibleValues.includes(interval)) {
    next();
  } else {
    res.status(400).send(`The interval parameter ${interval} is not valid`);
  }
}

module.exports = (io) => {
  evAPI.post('/generate/:interval', validateInterval, (req, res) => {
    const { interval } = req.params;
    const { evParameters, bessParameters} = req.body;
    
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
          
          preAddEvPower(dateInterval, parseInt(evParameters.numOfEvLevel2), parseInt(evParameters.numOfEvLevel3))
          .then(() => addEvConfig(evParameters))
          .then(() => getNewSchedule(socket))
          .then((schedule) => {
            socket.emit("Generate Ev", interval, evParameters, bessParameters, schedule);
            res.sendStatus(200)
          })
          .catch((err) => {
            res.sendStatus(500);
            console.error(err);
          })
        });
      } else {
        res.status(400).send("Cannot generate data while there is still data in the database, send the delete request first")
      }
    });
  });

  evAPI.get('/config', (req, res) => {

    evConfig.findById(1)
    .then((doc) => {
      res.send(doc);
    })
    .catch(err => res.status(500).send(err))
    
  });

  evAPI.get('/status', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Status Check Ev", (data) => {
      if (!data) {
        res.status(500).send('No data received, check to see if you ran real time data')
      }

      res.send(data);
    });
  });

  evAPI.get('/status/chargers', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Status Check Ev Chargers", (data) => {
      if (!data) {
        res.status(500).send('No data received, check to see if you ran real time data')
      }

      res.send(data);
    });
  });

  evAPI.get('/count', (req, res) => {
    evPower.estimatedDocumentCount()
    .then((count) => {
      res.send({count})
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    })
  });

  evAPI.get('/:interval', validateInterval, (req, res) => {
    const { interval } = req.params;
      getEvData(interval)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.sendStatus(500);
        console.log(err);
      })
  });


  evAPI.delete('/', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Stop Ev Power", response => {
      removeAllEv()
      .then(() => removeAllBess())
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
    });
  }) 

  return evAPI;
}
