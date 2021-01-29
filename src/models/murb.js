const mongoose = require('mongoose');

// Define Schemas
const murbPowerSchema = new mongoose.Schema({
  TimeStamp: {
    type: Date,
    unique: true,
    index: true,
  },
  Power: Number
});

const murbAggregatedPowerSchema = new mongoose.Schema({
  TimeStamp: {
    type: Date,
    unique: true,
    index: true,
  },
  Power: Number,
  AggregatedAmount: Number,
});

// Define Models
const murbPower = mongoose.model('MURB-Power', murbPowerSchema);
const murbPowerHourly = mongoose.model('MURB-Power-Hourly', murbAggregatedPowerSchema);
const murbPowerDaily = mongoose.model('MURB-Power-Daily', murbAggregatedPowerSchema);
const murbPowerWeekly = mongoose.model('MURB-Power-Weekly', murbAggregatedPowerSchema);
const murbPowerMonthly = mongoose.model('MURB-Power-Monthly', murbAggregatedPowerSchema);

module.exports = {
  murbPower,
  murbPowerHourly,
  murbPowerDaily,
  murbPowerWeekly,
  murbPowerMonthly
}