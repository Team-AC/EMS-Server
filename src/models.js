const mongoose = require('mongoose');

const murbSchema = new mongoose.Schema({
  TimeStamp: String,
  Power: Number
});

const murb = mongoose.model('MURB-Power', murbSchema);

module.exports = {
  murb,
}