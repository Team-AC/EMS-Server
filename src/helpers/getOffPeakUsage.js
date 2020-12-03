function avgPowerFromData(data) {
  return data.map(data => data.Power).reduce((sum, n) => sum + n)
}

module.exports = (aggregatedData) => {

  const amountOfPoints = Math.floor(aggregatedData.length * 0.25) // Getting bottom 25% of points
  let offPeakArray = aggregatedData.slice(0, amountOfPoints);

  for (let i=0; i < aggregatedData.length - amountOfPoints; i++) {
    const checkArray = aggregatedData.slice(i, i + amountOfPoints)
    if (avgPowerFromData(offPeakArray) >= avgPowerFromData(checkArray)) {
      offPeakArray = checkArray;
    } 
  }

  return {
    starts: offPeakArray[0].TimeStamp,
    ends: offPeakArray[amountOfPoints - 1].TimeStamp
  };
}



