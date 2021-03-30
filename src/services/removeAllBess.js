const { bess, bessConfig, energy } = require("../models/bess")

module.exports = () => {
  return Promise.all([
    bess.remove({}).exec(),
    bessConfig.remove({}).exec(),
    energy.remove({}).exec(),
  ]);
}