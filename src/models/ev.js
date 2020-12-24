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
});

const evPower = mongoose.model('EV-Power', evSchema);

module.exports = {
  evPower,
}