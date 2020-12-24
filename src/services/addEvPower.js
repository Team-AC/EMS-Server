const { evPower } = require("../models/ev");

module.exports = (data) => {
  evPower.create(data);
}