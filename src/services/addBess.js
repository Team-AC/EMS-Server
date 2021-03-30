const { bess } = require("../models/bess")

module.exports = (data) => {
  return bess.create(data);
}