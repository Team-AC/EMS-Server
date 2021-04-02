const { subDays } = require("date-fns");
const getCostFromPower = require("../helpers/getCostFromPower");
const getOffPeakUsage = require("../helpers/getOffPeakUsage");
const getPeakUsage = require("../helpers/getPeakUsage");
const { evPower, evPowerDaily, evPowerWeekly, evPowerMonthly, evPowerHourly } = require('../models/ev');

const amountOfDaysToSub = {
  "pastDay": 1,
  "pastWeek": 7,
  "pastWeekHourly": 7,
  "pastMonth": 30,
  "past3Months": 90,
  "pastYear": 365
}

const model = {
  "pastDay": evPowerHourly,
  "pastWeek": evPowerDaily,
  "pastWeekHourly": evPowerHourly,
  "pastMonth": evPowerDaily,
  "past3Months": evPowerWeekly,
  "pastYear": evPowerMonthly
}

module.exports = (interval) => {

  return model[interval].find({
    TimeStamp: {
      $gte: subDays(new Date(), amountOfDaysToSub[interval]),
      $lte: new Date()
    }
  }).lean().exec()
  .then(data => {
    const aggregatedData = [];

    data.forEach(({TimeStamp, Power, TotalPower, AggregatedAmount, TotalChargeTime, ...restData}) => {
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
    });
    
    // const peakUsage = getPeakUsage(aggregatedData);
    // const offPeakUsage = getOffPeakUsage(aggregatedData);

    return {
      aggregatedData,
      interval
    }
  })

}