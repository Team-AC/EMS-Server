const mongoose = require('mongoose');

// Define Schemas
const bessSchema = new mongoose.Schema({
  TimeStamp: Date,
  CurrentCharge: Number,
  ChargingStatus: String,
  NeedToCharge: Number
});

const bessConfigSchema = new mongoose.Schema({
  _id: Number,
}, { strict: false });

const energySchema = new mongoose.Schema({
  TimeStamp: Date,
  BessEvUsage: Number,
  GridEvUsage: Number
}, { strict: false });

bessSchema.index({TimeStamp: 1, bessChargerType: 1, bessChargerNumber: 1}, { unique: true })
// bessAggregatedSchema.index({TimeStamp: 1, bessChargerType: 1, bessChargerNumber: 1}, { unique: true })

const bess = mongoose.model('BESS', bessSchema);
const energy = mongoose.model('Energy', energySchema);
// const bessDaily = mongoose.model('bess-Power-Daily', bessAggregatedPowerSchema);
// const bessWeekly = mongoose.model('bess-Power-Weekly', bessAggregatedPowerSchema);
// const bessMonthly = mongoose.model('bess-Power-Monthly', bessAggregatedPowerSchema);
// const bessConfig = mongoose.model('bess-Config', bessConfigSchema);

module.exports = {
  bess,
  energy,
  // bessDaily,
  // bessWeekly,
  // bessMonthly,
  // bessConfig
}