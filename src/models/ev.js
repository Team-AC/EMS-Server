const mongoose = require('mongoose');

// Define Schemas
const evPowerSchema = new mongoose.Schema({
  TimeStamp: {
    type: Date,
    unique: true,
    index: true,
  },
  Power: Number,
  ChargeTime: Number,
  EvChargerNumber: Number,
  EvChargerType: Number,
});

const evPower = mongoose.model('EV-Power', evPowerSchema);

module.exports = {
  evPower,
}