// --- Config --- //

// dotenv
require('dotenv').config();

// Express
const express = require('express');
const app = express();
const portServer = 3000;
const portSocket = 3002;
app.use(express.json({limit: "5mb"}));

// MongoDB
require('./config/mongo');

// Cors
const cors = require('cors');
app.use(cors());

// --- Server --- //

// Socket.io
const io = require('socket.io')({});
io.on('connection', socket => {
  console.log("A Client has connected!");
  require('./sockets/sockets')(socket);
});

// Router
const api = require('./api/api')(io);

app.use('/api', api);

 // Listening to HTTP
app.listen(portServer, () => {
  console.log(`EMS-Server listening at http://localhost:${portServer}`);
})

 // Listening to Socket.io
io.listen(portSocket);


