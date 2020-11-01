// Config
require('dotenv').config();

const express = require('express');
const app = express();
const port = 3001;

require('./config/mongo');

// Routes
const api = require('./api/api');

app.use('/api', api);

// Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

