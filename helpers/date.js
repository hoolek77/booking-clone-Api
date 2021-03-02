exports.addDaysToDate = (date, days) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
