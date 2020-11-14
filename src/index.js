// --- Config --- //

// dotenv
require('dotenv').config();

// Express
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json({limit: "5mb"}));

// MongoDB
require('./config/mongo');

// Cors
const cors = require('cors');
app.use(cors());

// --- Routes ---//
const api = require('./api/api');

app.use('/api', api);

// --- Server --- //

// Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', socket => {
  console.log("Connected to Python Socket.io Client!");
  require('./sockets/sockets')(socket);
});

 // Listening
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


