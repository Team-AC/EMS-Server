const mongoose = require('mongoose');

// Define Schemas
const evPowerSchema = new mongoose.Schema({
  TimeStamp: Date,
  Power: Number,
  ChargeTime: Number,
  EvChargerNumber: Number,
  EvChargerType: Number,
});

// Define Schemas
const evAggregatedPowerSchema = new mongoose.Schema({
  TimeStamp: Date,
  TotalPower: Number,
  TotalChargeTime: Number,
  EvChargerNumber: Number,
  EvChargerType: Number,
  AggregatedAmount: Number
});

evPowerSchema.index({TimeStamp: 1, EvChargerType: 1, EvChargerNumber: 1}, { unique: true })
evAggregatedPowerSchema.index({TimeStamp: 1, EvChargerType: 1, EvChargerNumber: 1}, { unique: true })

const evPower = mongoose.model('EV-Power', evPowerSchema);
const evPowerDaily = mongoose.model('EV-Power-Daily', evAggregatedPowerSchema);
const evPowerWeekly = mongoose.model('EV-Power-Weekly', evAggregatedPowerSchema);
const evPowerMonthly = mongoose.model('EV-Power-Monthly', evAggregatedPowerSchema);

module.exports = {
  evPower,
  evPowerDaily,
  evPowerWeekly,
  evPowerMonthly
}