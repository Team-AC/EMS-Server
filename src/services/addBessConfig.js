const { bessConfig } = require("../models/bess")

module.exports = (configData) => {
  const bessConfigDoc = new bessConfig(configData);
  bessConfigDoc._id = 1;

  return bessConfigDoc.save();
}