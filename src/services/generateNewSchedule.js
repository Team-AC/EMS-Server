const { startOfHour } = require("date-fns");
const buildSchedule = require("./buildSchedule");

module.exports = (hours, data, bessConfig) => {
    // Hours in UTC
  const idealTimes = {
    // mid-peak
    discharge_ev: [{
      startHour: 11,
      endHour: 17,
    }],
    // on-peak
    discharge_arbitrage: [{
      startHour: 7,
      endHour: 11,
    }, {
      startHour: 17,
      endHour: 19,
    }],
    // off-peak
    charge: [{
      startHour: 19,
      endHour: 23,
    }, {
      startHour: 0,
      endHour: 7,
    }],
  }

  function getIdealTimeFromHour(hourDate) {
    const hour = hourDate.getHours();

    for (const idealTime in idealTimes) {
      for (const {startHour, endHour} of idealTimes[idealTime]) {
        if ((hour >= startHour) && (hour <= endHour)) {
          return idealTime;
        }
      }
    }
  }

  const idealTimesEvUsage = {
    discharge_ev: {
      power: 0,
      amountEvs: 0,
    },
    discharge_arbitrage: {
      power: 0,
      amountEvs: 0,
    },
    charge: {
      power: 0,
      amountEvs: 0,
    },
  };

  const {batteryPower, batteryCapacity} = bessConfig;
  
  hours.forEach((hourDate, index) => {
    const idealTime = getIdealTimeFromHour(hourDate);
    
    idealTimesEvUsage[idealTime].amountEvs += data[index][0];
    idealTimesEvUsage[idealTime].power += data[index][1];
  });

  let builtSchedule;

  if (idealTimesEvUsage.discharge_ev.power + idealTimesEvUsage.discharge_arbitrage.power >= batteryCapacity) {
    builtSchedule = buildSchedule(idealTimes, batteryCapacity, batteryPower);
  } else {
    builtSchedule = buildSchedule(idealTimes, idealTimesEvUsage.discharge_ev.power, batteryPower);
  }

  if (buildSchedule) {
    return builtSchedule;
  } else {
    return [];
  }
}