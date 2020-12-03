module.exports = (power, timestamp) => {        
  const hour = timestamp.getHours();
  const month = timestamp.getMonth();
  const date = timestamp.getDate();
  const day = timestamp.getDay();
  
  power = power/4;
  switch(month) {
    case 10://nov
    case 11://dec
    case 0://jan
    case 1://feb
    case 2://mar
    case 3://apr
      // Nov - Apr
      if ( day !== 0 || day !== 6 ){ // weekday
        if (hour >= 11 && hour <  17){// mid peak
          cost = power *.15;
          }else if ((hour >= 7 && hour < 11) || (hour >= 17 && hour < 19)) {//  on peak
           
            cost =  power * .217; 
              }else{//off peak
                
                cost =  power *0.105;
              }
      }else{//weekend
        cost =  power * .105;
      }
      break;

    case 4://may
    case 5://june
    case 6://jul
    case 7://aug
    case 8://sept
    case 9://oct
     // May - Oct
     if (day !== 0 || day !== 6){ // weekday
        if(hour >= 11 && hour <  17){// on peak
          cost = power * .217;
           }else if ((hour >= 5 && hour < 11) || (hour >= 17 && hour < 19)) {//  mid peak
              cost =  power * .15; 
             }else{// off peak
               cost =  power * .105;
              }
      }else{//weekend
      cost =  power * .105;
      }
      
      break;
  }
  
  return cost

}