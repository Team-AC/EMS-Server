module.exports = (historicData, evPredictParams, hours, socket) => {
  return new Promise((resolve) => {
    socket.emit("Generate EV Prediction", historicData, evPredictParams, hours, (data) => {
      resolve(data);
    });
  })
}