const { energy } = require("../models/bess")

module.exports = (data) => {
  return energy.create(data);
}