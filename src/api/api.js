const express = require('express');
const apiRouter = express.Router();

module.exports = (io) => {
  apiRouter.get('/health', (req, res) => {
    res.sendStatus(200);
  })

  const murbAPI = require('./murbApi')(io);
  apiRouter.use('/murb', murbAPI);

  const evAPI = require('./evApi')(io);
  apiRouter.use('/ev', evAPI);

  const bessAPI = require('./bessApi')(io);
  apiRouter.use('/bess', bessAPI);

  const designAPI = require('./designApi')(io);
  apiRouter.use('/design', designAPI);

  const optimizeAPI = require('./optimizeApi')(io);
  apiRouter.use('/optimize', optimizeAPI);

  return apiRouter
}