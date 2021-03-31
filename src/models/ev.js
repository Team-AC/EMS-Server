const mongoose = require('mongoose');

// Define Schemas
const evPowerSchema = new mongoose.Schema({
  TimeStamp: Date,
  Power: Number,
  ChargeTime: Number,
  EvChargerNumber: Number,
  EvChargerType: Number,
});

const evAggregatedPowerSchema = new mongoose.Schema({
  TimeStamp: Date,
  TotalPower: Number,
  TotalChargeTime: Number,
  EvChargerNumber: Number,
  EvChargerType: Number,
  AggregatedAmount: Number
});

const evConfigSchema = new mongoose.Schema({
  _id: Number,
  NumberOfLevel2: Number,
  NumberOfLevel3: Number,
}, { strict: false });

const evPredictConfigSchema = new mongoose.Schema({
  _id: Number,
  WeightPastMonth: Number,
  WeightPastYear: Number,
  WeightPastWeek: Number,
}, { strict: false });

evPowerSchema.index({TimeStamp: 1, EvChargerType: 1, EvChargerNumber: 1}, { unique: true })
evAggregatedPowerSchema.index({TimeStamp: 1, EvChargerType: 1, EvChargerNumber: 1}, { unique: true })

const evPower = mongoose.model('EV-Power', evPowerSchema);
const evPowerHourly = mongoose.model('EV-Power-Hourly', evAggregatedPowerSchema);
const evPowerDaily = mongoose.model('EV-Power-Daily', evAggregatedPowerSchema);
const evPowerWeekly = mongoose.model('EV-Power-Weekly', evAggregatedPowerSchema);
const evPowerMonthly = mongoose.model('EV-Power-Monthly', evAggregatedPowerSchema);
const evConfig = mongoose.model('EV-Config', evConfigSchema);
const evPredictConfig = mongoose.model('EV-Predict-Config', evPredictConfigSchema);

module.exports = {
  evPower,
  evPowerHourly,
  evPowerDaily,
  evPowerWeekly,
  evPowerMonthly,
  evConfig,
  evPredictConfig
}