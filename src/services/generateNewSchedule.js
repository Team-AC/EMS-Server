// Hours in UTC
const idealTimes = {
  // mid-peak
  discharge_ev: [{
    startHour: 11,
    endHour: 17,
  }],
  // on-peak
  arbitrage: [{
    startHour: 7,
    endHour: 11,
  }, {
    startHour: 17,
    endHour: 19,
  }],
  // off-peak
  charge: [{
    startHour: 19,
    endHour: 24,
  }, {
    startHour: 0,
    endHour: 11,
  }],
}

function getIdealTimeFromHour(hourDate) {
  const hour = hourDate.getHours();

  for (const property in idealTimes) {
    for (const interval of idealTimes[property]) {
      if (hour >= interval.startHour && hour <= interval.endHour) {
        return property;
      }
    }
  }
}

module.exports = (hours, data, bessConfig) => {
  const idealTimesUsage = {
    discharge_ev: {
      power: 0,
      amountEvs: 0,
    },
    arbitrage: {
      power: 0,
      amountEvs: 0,
    },
    charge: {
      power: 0,
      amountEvs: 0,
    },
  };
  
  hours.forEach((hourDate, index) => {
    const idealTime = getIdealTimeFromHour(hourDate);

    idealTimesUsage[idealTime].amountEvs += data[index][0];
    idealTimesUsage[idealTime].power += data[index][1];
  })

  return [];
}