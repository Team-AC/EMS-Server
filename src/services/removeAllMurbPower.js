const { murbPower, murbPowerHourly, murbPowerWeekly, murbPowerMonthly, murbPowerDaily } = require("../models/murb")

module.exports = () => {
  return Promise.all([
    murbPower.remove({}).exec(),
    murbPowerHourly.remove({}).exec(),
    murbPowerDaily.remove({}).exec(),
    murbPowerWeekly.remove({}).exec(),
    murbPowerMonthly.remove({}).exec()
  ]);
}