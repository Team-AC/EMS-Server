const { evConfig } = require("../models/ev")

module.exports = (configData) => {
  const evConfigDoc = new evConfig(configData);
  evConfigDoc._id = 1;

  return evConfigDoc.save();
}