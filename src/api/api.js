const express = require('express');
const apiRouter = express.Router();

module.exports = (io) => {
  const murbAPI = require('./murbApi')(io);
  apiRouter.use('/murb', murbAPI);

  return apiRouter
}