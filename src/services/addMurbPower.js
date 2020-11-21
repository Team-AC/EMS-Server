const { startOfDay, startOfWeek, startOfMonth, formatISO, parseISO, startOfHour } = require('date-fns');
const { murbPower, murbPowerDaily, murbPowerHourly, murbPowerWeekly, murbPowerMonthly } = require('../models/murb');

async function addAggregatedData(model, data) {
  const { Power, TimeStamp } = data;
  const currentDoc = await model.findOne({ 
    "TimeStamp": {
      $lte: TimeStamp,
      $gte: TimeStamp
    } 
  }, (err) => {
    if (err) console.log(err);
  }).exec();

  if (currentDoc) {
    return model.findByIdAndUpdate(currentDoc._id, {
      $inc: {
        Power,
        AggregatedAmount: 1
      }
    }).exec();
  } else {
      return model.create({
        Power,
        TimeStamp,
        AggregatedAmount: 1
      });
  }
}

module.exports = (data) => {
  const date = parseISO(data.TimeStamp)
  const dateHourly = startOfHour(date);
  const dateDaily = startOfDay(date);
  const dateWeekly = startOfWeek(date);
  const dateMonthly = startOfMonth(date);

  return Promise.all([
    murbPower.create(data),
    addAggregatedData(murbPowerHourly, {...data, TimeStamp: dateHourly}),
    addAggregatedData(murbPowerDaily, {...data, TimeStamp: dateDaily}),
    addAggregatedData(murbPowerWeekly, {...data, TimeStamp: dateWeekly}),
    addAggregatedData(murbPowerMonthly, {...data, TimeStamp: dateMonthly}),
  ]);
}
