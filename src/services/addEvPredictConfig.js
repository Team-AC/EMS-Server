const { evPredictConfig } = require("../models/ev")

module.exports = (configData) => {
  const evPredictConfigDoc = new evPredictConfig(configData);
  evPredictConfigDoc._id = 1;

  return evPredictConfigDoc.save();
}