const { addHours, eachHourOfInterval } = require("date-fns");
const getSocket = require("../helpers/getSocket");
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
    .then(data => {
      if (data.length === 0) {
        return defaultSchedule;
      } else {
        const newSchedule = generateNewSchedule(hours, data);
        if (newSchedule && newSchedule.length !== 0) {
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