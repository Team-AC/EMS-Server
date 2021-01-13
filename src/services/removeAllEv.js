const { evPower, evPowerWeekly, evPowerMonthly, evPowerDaily } = require("../models/ev")

module.exports = () => {
  return Promise.all([
    evPower.remove({}).exec(),
    evPowerDaily.remove({}).exec(),
    evPowerWeekly.remove({}).exec(),
    evPowerMonthly.remove({}).exec()
  ]);
}