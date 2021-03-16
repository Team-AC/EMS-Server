const { bess, energy } = require("../models/bess")

module.exports = () => {
  return Promise.all([
    bess.remove({}).exec(),
    energy.remove({}).exec(),
  ]);
}