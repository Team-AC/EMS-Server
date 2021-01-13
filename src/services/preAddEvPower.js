const { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } = require("date-fns");
const { evPowerDaily, evPowerWeekly, evPowerMonthly } = require("../models/ev");

// Creates a scaffold for aggregated data
function initializeAggregatedData(TimeStamps, amountOfLevel2, amountOfLevel3, model) {
  const promises = [];

  TimeStamps.forEach((TimeStamp) => {
    for (i = 1; i <= amountOfLevel2; i++){
      const promise = model.create({
        TotalPower: 0,
        TimeStamp,
        AggregatedAmount: 0,
        TotalChargeTime: 0,
        EvChargerNumber: i,
        EvChargerType: 2,
      });
  
      promises.push(promise);
    }

    for (i = 1; i <= amountOfLevel3; i++){
      const promise = model.create({
        TotalPower: 0,
        TimeStamp,
        AggregatedAmount: 0,
        TotalChargeTime: 0,
        EvChargerNumber: i,
        EvChargerType: 3,
      });
  
      promises.push(promise);
    }
  })

  return promises;
}

module.exports = (interval, amountOfLevel2, amountOfLevel3) => {
  const days = eachDayOfInterval(interval);
  const weeks = eachWeekOfInterval(interval);
  const months = eachMonthOfInterval(interval);

  const dailyInit = initializeAggregatedData(days, amountOfLevel2, amountOfLevel3, evPowerDaily);
  const weeklyInit = initializeAggregatedData(weeks, amountOfLevel2, amountOfLevel3, evPowerWeekly);
  const monthlyInit = initializeAggregatedData(months, amountOfLevel2, amountOfLevel3, evPowerMonthly);

  return Promise.all([].concat(
    dailyInit,
    weeklyInit,
    monthlyInit
  ));
}