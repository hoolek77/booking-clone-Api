const validateCreateReservationData = require('../validations/createReservation')

module.exports = function validateCreateReservation(req, res, next) {
  try {
    req.body = validateCreateReservationData(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
