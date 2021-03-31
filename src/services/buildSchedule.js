function createScheduleNode(startHour, startMinute, endHour, endMinute, mode) {
  return {
    start: {
      hour: startHour,
      minute: startMinute,
    },
    end: {
      hour: endHour,
      minute: endMinute,
    },
    mode,
  }
}

function getTotalHours(times) {
  let hours = 0;
  times.forEach(time => {
    hours += time.endHour - time.startHour;
  })

  return hours;
}

module.exports = (idealTimes, powerToUse, batteryPower) => {
  const schedule = [];
  let hoursDischargeEv = powerToUse/batteryPower;

  const hoursDischargeTotal = getTotalHours(idealTimes["discharge_ev"]) + getTotalHours(idealTimes["discharge_arbitrage"]);

  let hoursDischargeArbitrage = hoursDischargeTotal - hoursDischargeEv;
  if (hoursDischargeArbitrage < 0) hoursDischargeArbitrage = 0;

  for (const idealTime in idealTimes) {
    if (idealTime === "charge") {
      for (const {startHour, endHour} of idealTimes[idealTime]){
        schedule.push(createScheduleNode(startHour, 0, endHour, 59, idealTime));
      }
    } else if (idealTime === "discharge_ev") {
      for (const {startHour, endHour} of idealTimes[idealTime]){
        const hoursPossibleDischargeEv = endHour - startHour;

        if (hoursPossibleDischargeEv <= hoursDischargeEv) {
          schedule.push(createScheduleNode(startHour, 0, endHour, 59, idealTime));
          hoursDischargeEv -= hoursPossibleDischargeEv;
        } else {
          const endHourEv = startHour + Math.ceil(hoursDischargeEv);
          hoursDischargeEv = 0;
          schedule.push(createScheduleNode(startHour, 0, endHourEv, 0, idealTime));
          schedule.push(createScheduleNode(endHourEv, 0, endHour, 59, "discharge_arbitrage"));
        }
      }
    } else if (idealTime === "discharge_arbitrage") {
      for (const {startHour, endHour} of idealTimes[idealTime]){
        const hoursPossibleDischargeArbitrage = endHour - startHour;

        if (hoursPossibleDischargeArbitrage <= hoursDischargeArbitrage) {
          schedule.push(createScheduleNode(startHour, 0, endHour, 0, idealTime));
          hoursDischargeArbitrage -= hoursPossibleDischargeArbitrage;
        } else {
          const endHourArbitrage = startHour + Math.ceil(hoursDischargeArbitrage);
          hoursDischargeArbitrage = 0;
          schedule.push(createScheduleNode(startHour, 0, endHourArbitrage, 0, idealTime));
          schedule.push(createScheduleNode(endHourArbitrage, 0, endHour, 59, "discharge_ev"));
        }
      }
    }
    else {
      throw "buildSchedule did not receive 'charge, 'discharge_arbitrage' or 'discharge_ev'"
    }

  }

  return schedule;
}