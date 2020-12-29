const express = require('express');
const apiRouter = express.Router();

module.exports = (io) => {
  const murbAPI = require('./murbApi')(io);
  apiRouter.use('/murb', murbAPI);

  const evAPI = require('./evApi')(io);
  apiRouter.use('/ev', evAPI);

  return apiRouter
}