const { evPower } = require("../models/ev")

module.exports = () => {
  return Promise.all([
    evPower.remove({}).exec(),
  ]);
}