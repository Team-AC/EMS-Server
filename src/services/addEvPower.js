const { startOfDay, startOfWeek, startOfMonth, parseISO } = require('date-fns');
const { evPower, evPowerDaily, evPowerWeekly, evPowerMonthly } = require('../models/ev');

async function addAggregatedData(model, data) {
  const { Power, TimeStamp, ChargeTime, EvChargerNumber, EvChargerType } = data;

  return model.findOneAndUpdate({ 
    TimeStamp: {
      $lte: TimeStamp,
      $gte: TimeStamp
    },
    EvChargerNumber,
    EvChargerType
  }, {
    $inc: {
      TotalPower: Power,
      AggregatedAmount: 1,
      TotalChargeTime: ChargeTime
    }
  });
}

module.exports = (data) => {
  const date = parseISO(data.TimeStamp)
  const dateDaily = startOfDay(date);
  const dateWeekly = startOfWeek(date);
  const dateMonthly = startOfMonth(date);

  evPower.create(data);
  addAggregatedData(evPowerDaily, {...data, TimeStamp: dateDaily});
  addAggregatedData(evPowerWeekly, {...data, TimeStamp: dateWeekly});
  addAggregatedData(evPowerMonthly, {...data, TimeStamp: dateMonthly});
}