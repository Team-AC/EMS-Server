const { startOfDay, startOfWeek, startOfMonth, formatISO, parseISO, startOfHour } = require('date-fns');
const { murbPower, murbPowerDaily, murbPowerHourly, murbPowerWeekly, murbPowerMonthly } = require('../models/murb');

async function addAggregatedData(model, data) {
  const { Power, TimeStamp } = data;

  return model.findOneAndUpdate({ 
    "TimeStamp": {
      $lte: TimeStamp,
      $gte: TimeStamp
    } 
  }, {
    $inc: {
      Power,
      AggregatedAmount: 1
    }
  });
}

module.exports = (data) => {
  const date = parseISO(data.TimeStamp)
  const dateHourly = startOfHour(date);
  const dateDaily = startOfDay(date);
  const dateWeekly = startOfWeek(date);
  const dateMonthly = startOfMonth(date);

  murbPower.create(data);
  addAggregatedData(murbPowerHourly, {...data, TimeStamp: dateHourly});
  addAggregatedData(murbPowerDaily, {...data, TimeStamp: dateDaily});
  addAggregatedData(murbPowerWeekly, {...data, TimeStamp: dateWeekly});
  addAggregatedData(murbPowerMonthly, {...data, TimeStamp: dateMonthly});
}
