const express = require('express');

const murbAPI = require('./murbApi');

const apiRouter = express.Router();
apiRouter.use('/murb', murbAPI);

module.exports = apiRouter;