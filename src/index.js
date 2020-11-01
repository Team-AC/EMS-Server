require('dotenv').config();

// Dependencies
const express = require('express');

// Config
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

require('./config/mongo').run().catch(console.dir);;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})