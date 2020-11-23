const { eachHourOfInterval, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } = require("date-fns");
const { murbPowerHourly, murbPowerDaily, murbPowerWeekly, murbPowerMonthly } = require("../models/murb");

// Creates a scaffold for aggregated data, with Power and AggregatedAmount initialized to 0
function initializeAggregatedData(TimeStamps, model) {
  const promises = [];

  TimeStamps.forEach((TimeStamp) => {
    const promise = model.create({
      Power: 0,
      TimeStamp,
      AggregatedAmount: 0
    });

    promises.push(promise);
  })

  return promises;
}

module.exports = (interval) => {
  const hours = eachHourOfInterval(interval);
  const days = eachDayOfInterval(interval);
  const weeks = eachWeekOfInterval(interval);
  const months = eachMonthOfInterval(interval);

  const hourlyInit = initializeAggregatedData(hours, murbPowerHourly);
  const dailyInit = initializeAggregatedData(days, murbPowerDaily);
  const weeklyInit = initializeAggregatedData(weeks, murbPowerWeekly);
  const monthlyInit = initializeAggregatedData(months, murbPowerMonthly);

  return Promise.all([].concat(
    hourlyInit,
    dailyInit,
    weeklyInit,
    monthlyInit
  ));
}