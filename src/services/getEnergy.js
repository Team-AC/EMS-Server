const { subDays, isWithinInterval } = require('date-fns');
const { energy } = require("../models/bess")
const _ = require("lodash")

const amountOfDaysToSub = {
  "pastDay": 1,
  "pastWeek": 7,
  "pastMonth": 30,
  "past3Months": 90,
  "pastYear": 365
}

const energyDataStructure = {
  bess: {
    ev: 0,
    arbitrage: 0,
    load: 0,
  }, 
  grid: {
    ev: 0,
  }
}

module.exports = () => {
  const intervals = {};
  const aggregatedData = {};

  const currentTime = new Date();
  for (const [key, daysToSub] of Object.entries(amountOfDaysToSub)) {
    intervals[key] = {
      start: subDays(currentTime, daysToSub),
      end: currentTime
    }

    aggregatedData[key] = _.cloneDeep(energyDataStructure)
  }

  return energy.find({}).exec()
  .then(allData => {
    allData.forEach(data => {
      for (const [key, interval] of Object.entries(intervals)) {
        if (isWithinInterval(data.TimeStamp, interval)) {
          aggregatedData[key].bess.ev += data.BessEvUsage;
          aggregatedData[key].grid.ev += data.GridEvUsage;
          aggregatedData[key].bess.arbitrage += data.BessArbitrage;
        }
      }
    })

    return aggregatedData;
  })
}