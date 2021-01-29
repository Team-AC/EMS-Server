const { eachHourOfInterval, addHours } = require('date-fns');
const express = require('express');
const getSocket = require('../helpers/getSocket');
const getEvData = require('../services/getEvData');

const designApi = express.Router();

module.exports = (io) => {

  designApi.post('/ev/predict', (req, res) => {
    const socket = getSocket(io);

    const evPredictParams = req.query;

    const intervals = [
      'pastMonth',
      'past3Months',
      'pastYear',
    ];

    const getEvDataPromises = [];

    const now = new Date();
    const interval = {
      start: now, 
      end: addHours(now, 24)
    };

    const hours = eachHourOfInterval(interval);
    
    intervals.forEach(interval => {
      getEvDataPromises.push(getEvData(interval));
    })

    Promise.all(getEvDataPromises)
    .then((historicData) => {
      socket.emit("Generate EV Prediction", historicData, evPredictParams, hours, (data) => {
        res.send(data);
      });
    })


  })

  return designApi;
}