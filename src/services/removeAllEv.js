const { evPower, evPowerHourly, evPowerWeekly, evPowerMonthly, evPowerDaily, evConfig } = require("../models/ev")

module.exports = () => {
  return Promise.all([
    evPower.remove({}).exec(),
    evPowerHourly.remove({}).exec(),
    evPowerDaily.remove({}).exec(),
    evPowerWeekly.remove({}).exec(),
    evPowerMonthly.remove({}).exec(),
    evConfig.remove({}).exec()
  ]);
}