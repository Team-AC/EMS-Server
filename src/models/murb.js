const mongoose = require('mongoose');

const murbSchema = new mongoose.Schema({
  TimeStamp: Date,
  Power: Number
});

const murbPower = mongoose.model('MURB-Power', murbSchema);

module.exports = {
  murbPower,
}