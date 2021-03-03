const { bess } = require("../models/bess")

module.exports = () => {
  return Promise.all([
    bess.remove({}).exec(),
  ]);
}