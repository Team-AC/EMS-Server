const { subHours, formatISO, isSameHour, startOfHour, parseISO, getHours, subMonths, subDays } = require('date-fns');
const express = require('express');
const _ = require('lodash');
const { Model } = require('mongoose');
const getCostFromPower = require('../helpers/getCostFromPower');
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

module.exports = (io) => {
  murbAPI.post('/generate/:interval', validateInterval, (req, res) => {
    const { interval } = req.params;
    
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
            socket.emit("Generate Murb Power", interval);
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

  // murbAPI.get('/', (req, res) => {
  //   const {startDate, endDate} = req.query;

  //   murbPower.find({
  //     TimeStamp: {
  //       $gte: startDate,
  //       $lte: endDate
  //     }
  //   }, (err, murbs) => {
  //     if (err) return console.error(err);

  //     if (murbs.length > 100) {
  //       res.status(404).send({error: "Requested more than a 100 points"});
  //     } else {
  //       res.send(murbs);
  //     }
  //   });
  // });

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

  function avgPowerFromData(data) {
    return data.map(data => data.Power).reduce((sum, n) => sum + n)
  }
  
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
      "pastMonth": murbPowerWeekly,
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

      if (err) {
        res.sendStatus(500);
      } else {
        res.send({
          peakUsage: null,
          offPeakUsage: null,
          aggregatedData
        });
      }
    });
  });

  // murbAPI.get('/pastDay', (req, res) => {
  //   murbPower.find({
  //     TimeStamp: {
  //       $gte: formatISO(subHours(new Date(), 24)),
  //       $lte: formatISO(new Date())
  //     }
  //   }, (err, murbs) => {

  //     const murbsAggregatedHours = murbs.map((murb) => ({
  //       Power: murb.Power,
  //       TimeStamp: startOfHour(murb.TimeStamp)
  //     }));

  //     let aggregatedData = [];
  //     let aggregatingHour = murbsAggregatedHours[0];
  //     let aggregatingPower = [];

  //     for (const murb of murbsAggregatedHours) {
  //       if (isSameHour(murb.TimeStamp, aggregatingHour.TimeStamp)) {
  //         aggregatingPower.push(murb.Power);
  //       } else {
  //         aggregatedData.push({
  //           Power: aggregatingPower.reduce((sum, n) => sum + n)/aggregatingPower.length,
  //           TimeStamp: aggregatingHour.TimeStamp
  //         });
  //         aggregatingHour = murb;
  //         aggregatingPower = [];
  //       }
  //     }

  //     let peakArray = aggregatedData.slice(0,4);
  //     for (let i=0; i < aggregatedData.length - 4; i++) {
  //       const checkArray = aggregatedData.slice(i, i + 4)
  //       if (avgPowerFromData(peakArray) <= avgPowerFromData(checkArray)) {
  //         peakArray = checkArray;
  //       } 
  //     }

  //     const peakHours = `${getHours(peakArray[0].TimeStamp)} - ${getHours(_.last(peakArray).TimeStamp)}`

  //     let offPeakArray = aggregatedData.slice(0,4);
  //     for (let i=0; i < aggregatedData.length - 4; i++) {
  //       const checkArray = aggregatedData.slice(i, i + 4)
  //       if (avgPowerFromData(offPeakArray) >= avgPowerFromData(checkArray)) {
  //         offPeakArray = checkArray;
  //       } 
  //     }

  //     const offPeakHours = `${getHours(offPeakArray[0].TimeStamp)} - ${getHours(_.last(offPeakArray).TimeStamp)}`

  //     if (err || !aggregatedData) {
  //       res.sendStatus(500);
  //     } else {
  //       res.send({
  //         peakHours,
  //         offPeakHours,
  //         aggregatedData
  //       });
  //     }
  //   });
  // });

  return murbAPI;
}