const mongoose = require('mongoose');

const murbSchema = new mongoose.Schema({
  TimeStamp: {
    type: Date,
    unique: true
  },
  Power: Number
});

const murbPower = mongoose.model('MURB-Power', murbSchema);

module.exports = {
  murbPower,
}