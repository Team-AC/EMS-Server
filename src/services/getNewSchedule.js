const { addHours, eachHourOfInterval } = require("date-fns");
const getSocket = require("../helpers/getSocket");
const { bessConfig } = require("../models/bess");
const { evPredictConfig } = require("../models/ev");
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

module.exports = async (socket) => {
    const evPredictParams = await evPredictConfig.findById(1).exec();
    const bessData = await bessConfig.findById(1).exec();

    const intervals = [
      'pastMonth',
      'pastWeekHourly',
      'pastYear',
    ];

    const getEvDataPromises = [];

    const now = new Date();
    const interval = {
      start: now, 
      end: addHours(now, 24)
    };

    let hours = eachHourOfInterval(interval);
    hours = hours.filter(hour => hour.toUTCString());

    
    intervals.forEach(interval => {
      getEvDataPromises.push(getEvData(interval));
    })

    return Promise.all(getEvDataPromises)
    .then((historicData) => {
      return getEvPredict(historicData, evPredictParams, hours, socket);
    })
    .then(evPredictData => {
      if (!evPredictData?.length) {
        return defaultSchedule;
      } else {
        const newSchedule = generateNewSchedule(hours, evPredictData, bessData);
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