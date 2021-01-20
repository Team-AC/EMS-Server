const { subDays } = require('date-fns');
const express = require('express');
const getCostFromPower = require('../helpers/getCostFromPower');
const getOffPeakUsage = require('../helpers/getOffPeakUsage');
const getPeakUsage = require('../helpers/getPeakUsage');
const getSocket = require('../helpers/getSocket');
const { evPower, evPowerDaily, evPowerWeekly, evPowerMonthly, evConfig } = require('../models/ev');
const addEvConfig = require('../services/addEvConfig');
const preAddEvPower = require('../services/preAddEvPower');
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
          
          preAddEvPower(dateInterval, parseInt(evParameters.numOfEvLevel2), parseInt(evParameters.numOfEvLevel3))
          .then(() => addEvConfig(evParameters))
          .then(() => {
            socket.emit("Generate Ev", interval, evParameters);
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

  evAPI.get('/:interval', validateInterval, (req, res) => {
    const { interval } = req.params;
    
    const amountOfDaysToSub = {
      "pastDay": 1,
      "pastWeek": 7,
      "pastMonth": 30,
      "past3Months": 90,
      "pastYear": 365
    }

    const model = {
      "pastDay": evPower,
      "pastWeek": evPowerDaily,
      "pastMonth": evPowerDaily,
      "past3Months": evPowerWeekly,
      "pastYear": evPowerMonthly
    }

    model[interval].find({
      TimeStamp: {
        $gte: subDays(new Date(), amountOfDaysToSub[interval]),
        $lte: new Date()
      }
    }, (err, data) => {
      const aggregatedData = [];

      if (interval === "pastDay") {
        data.forEach(data => {
          aggregatedData.push({
            ...data,
            Cost: getCostFromPower(data.Power, data.TimeStamp),
          })
        })
      }

      data.forEach(({TimeStamp, Power, TotalPower, AggregatedAmount, TotalChargeTime, ...restData}) => {
        if (TotalPower) {
          aggregatedData.push({
            TimeStamp,
            TotalPower,
            TotalChargeTime,
            AggregatedAmount,
            AveragePowerPerEv: TotalPower/AggregatedAmount,
            AverageChargeTimePerEv: TotalChargeTime/AggregatedAmount,
            Cost: getCostFromPower(TotalPower, TimeStamp),
            ...restData
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
    }).lean();
  });


  evAPI.delete('/', (req, res) => {
    const socket = getSocket(io);

    socket.emit("Stop Ev Power", response => {
      removeAllEv()
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
