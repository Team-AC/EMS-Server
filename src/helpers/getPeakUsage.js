function avgPowerFromData(data) {
  return data.map(data => data.Power).reduce((sum, n) => sum + n)
}

module.exports = (aggregatedData) => {

  const amountOfPoints = Math.round(aggregatedData.length * 0.25) // Getting top 25% of points
  if (amountOfPoints <= 1) return null;

  let peakArray = aggregatedData.slice(0, amountOfPoints);

  for (let i=0; i < aggregatedData.length - amountOfPoints; i++) {
    const checkArray = aggregatedData.slice(i, i + amountOfPoints)
    if (avgPowerFromData(peakArray) <= avgPowerFromData(checkArray)) {
      peakArray = checkArray;
    } 
  }

  return {
    starts: peakArray[0].TimeStamp,
    ends: peakArray[amountOfPoints - 1].TimeStamp
  };
}



