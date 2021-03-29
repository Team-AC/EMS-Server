const { addHours, eachHourOfInterval } = require("date-fns");
const getSocket = require("../helpers/getSocket");
const { bessConfig } = require("../models/bess");
const generateNewSchedule = require("./generateNewSchedule");
const getEvData = require("./getEvData");
const getEvPredict = require("./getEvPredict");

const defaultSchedule = [{
  start: {
    hour: 0,
    minute: 0,
  },
  end: {
    hour: 8,
    minute: 0,
  },
  mode: "charge"
}, {
  start: {
    hour: 8,
    minute: 0,
  },
  end: {
    hour: 16,
    minute: 0,
  },
  mode: "discharge_ev"
}, 
{
  start: {
    hour: 16,
    minute: 0,
  },
  end: {
    hour: 23,
    minute: 59,
  },
  mode: "discharge_arbitrage"
},
];

module.exports = (socket) => {
    const evPredictParams = {};

    const intervals = [
      'pastMonth',
      'past3Months',
      'pastYear',
    ];

    const getEvDataPromises = [];

    const now = new Date();
    const interval = {
      start: now, 
      end: addHours(now, 24)
    };

    const hours = eachHourOfInterval(interval);
    
    intervals.forEach(interval => {
      getEvDataPromises.push(getEvData(interval));
    })

    return Promise.all(getEvDataPromises)
    .then((historicData) => {
      return getEvPredict(historicData, evPredictParams, hours, socket);
    })
    .then(async (evPredictData) => {
      return { evPredictData, bessData: await bessConfig.findById(1).exec() };
    })
    .then(promiseData => {
      const {evPredictData: data, bessData} = promiseData;
      if (!data?.length) {
        return defaultSchedule;
      } else {
        const newSchedule = generateNewSchedule(hours, data, bessData);
        if (newSchedule && newSchedule?.length) {
          return newSchedule;
        } else {
          return defaultSchedule;
        }
      }
    })
    .catch(err => {
      console.error(err);
    })
}