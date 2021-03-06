exports.addDaysToDate = (date, days) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

exports.formatDate = (date, isBooking = false) => {
  const result = new Date(date);

  // allowing us to check if room is allowed for the same or not. 
  // booking at 2 pm, in other case midnight
  const time = isBooking ? 15 : 25

  result.setHours(time);
  result.setMinutes(0);
  result.setSeconds(0);
  return result.toISOString().split('.')[0]+"Z"
}
