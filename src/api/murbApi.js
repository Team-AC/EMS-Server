const { subHours, formatISO, isSameHour, startOfHour, parseISO, getHours, subMonths, subDays } = require('date-fns');
const express = require('express');
const _ = require('lodash');
const { Model } = require('mongoose');
const getCostFromPower = require('../helpers/getCostFromPower');
const getOffPeakUsage = require('../helpers/getOffPeakUsage');
const getPeakUsage = require('../helpers/getPeakUsage');
const getSocket = require('../helpers/getSocket');
const murbAPI = express.Router();
const { murbPower, murbPowerDaily, murbPowerHourly, murbPowerWeekly, murbPowerMonthly } = require('../models/murb');
const preAddMurbPower = require('../services/preAddMurbPower');
const removeAllMurbPower = require('../services/removeAllMurbPower');

function validateInterval(req, res, next) {
  const { interval } = req.params;
  const possibleValues = [
    "pastDay",
    "pastWeek",
    "pastMonth",
    "pastYear"
  ];

  if (possibleValues.includes(interval)) {
    next();
  } else {
    res.status(400).send(`The interval parameter ${interval} is not valid`);
  }
}

function validateMurbParameters(req, res, next) {
  const murbParameters = req.query;
  const requiredValues = [
    "avgPower",
    "minPower",
    "maxPower"
  ];

  let error = false;
  requiredValues.forEach((requireValue) => {
    if (!murbParameters[requireValue] || !parseFloat(murbParameters[requireValue])) {
      error = true;
    }
  });

  if (error) {
    res.status(400).send(`The MURB parameters ${JSON.stringify(murbParameters)} are not valid. Make sure you have all the required parameters and they are valid non-zero numbers`);
  } else {
    next();
  }
}

module.exports = (io) => {
  murbAPI.post('/generate/:interval', validateInterval, validateMurbParameters, (req, res) => {
    const { interval } = req.params;
    const murbParameters = req.query;
    
    const socket = getSocket(io);

    const amountOfDaysToSub = {
      "pastDay": 1,
      "pastWeek": 7,
      "pastMonth": 30,
      "pastYear": 365
    }
  
    murbPower.estimatedDocumentCount()
    .then((count) => {
      if ((count == 0)) {
        
        socket.emit("Pre - Generate Murb Power", () => {
          const dateInterval = {
            start: subDays(new Date(), amountOfDaysToSub[interval]),
            end: new Date()
          }

          preAddMurbPower(dateInterval)
          .then(() => {
            socket.emit("Generate Murb Power", interval, murbParameters);
            res.sendStatus(200);
          })
          .catch((err) => {
            res.status(400).send(err)
          })
        });
      } else {
        res.status(400).send("Cannot generate data while there is still data in the database, send the delete request first")
      }

    })

  });

  murbAPI.delete('/', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Stop Murb Power", (response) => {
      removeAllMurbPower()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(500).send(err);
      })
    });
  });

  murbAPI.get('/count', (req, res) => {
    murbPower.estimatedDocumentCount()
    .then((count) => {
      res.send({count})
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    })
  });

  murbAPI.get('/status', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Status Check", (data) => {
      res.send(data);
    });
  });
  
  murbAPI.get('/:interval', validateInterval, (req, res) => {
    const { interval } = req.params;
    
    const amountOfDaysToSub = {
      "pastDay": 1,
      "pastWeek": 7,
      "pastMonth": 30,
      "pastYear": 365
    }

    const model = {
      "pastDay": murbPowerHourly,
      "pastWeek": murbPowerDaily,
      "pastMonth": murbPowerDaily,
      "pastYear": murbPowerMonthly
    }

    model[interval].find({
      TimeStamp: {
        $gte: subDays(new Date(), amountOfDaysToSub[interval]),
        $lte: new Date()
      }
    }, (err, data) => {
      aggregatedData = [];

      data.forEach(({TimeStamp, Power, AggregatedAmount}) => {
        if (Power) {
          aggregatedData.push({
            TimeStamp,
            Power: Power/AggregatedAmount,
            Cost: getCostFromPower(Power, TimeStamp)
          })
        }
      });
      
      const peakUsage = getPeakUsage(aggregatedData);
      const offPeakUsage = getOffPeakUsage(aggregatedData);

      if (err) {
        res.sendStatus(500);
      } else {
        res.send({
          peakUsage,
          offPeakUsage,
          aggregatedData
        });
      }
    });
  });

  return murbAPI;
}