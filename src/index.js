// Config
require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

require('./config/mongo');

const cors = require('cors');
app.use(cors());

// Routes
const api = require('./api/api');

app.use('/api', api);

// Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

