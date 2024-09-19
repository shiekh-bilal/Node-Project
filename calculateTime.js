const moment = require('moment');

function calculateRemainingTime(checkin, checkout, short) {
  // const start = new Date(`1970-01-01T${checkin}:00Z`);
  // const end = new Date(`1970-01-01T${checkout}:00Z`);
    
  // // Calculate the difference in milliseconds
  // const diff = end - start;
  
  // // Convert milliseconds to hours
  // const hours = diff / (1000 * 60 * 60);
  // return moment.utc(hours);

  const workingHours = 8 * 60;  // 8 hours in minutes
  const checkinTime = moment(checkin, "HH:mm");
  
  const checkoutTime = moment(checkout, "HH:mm");
  
  const shortTime = short
  

  const workedMinutes = checkoutTime.diff(checkinTime, 'hours');
  
  const remainingMinutes = shortTime - workedMinutes ;
  

  return remainingMinutes;
}

module.exports = calculateRemainingTime;
