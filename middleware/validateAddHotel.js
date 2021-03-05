const validateAddHotelData = require('../validations/addHotel')
const validateAddressData = require('../validations/address')
const validateRoom = require('../validations/room')

module.exports = function validateAddHotel(req, res, next) {
  try {
    req.body = validateAddHotelData(req.body)
    req.body.localization = validateAddressData(req.body.localization)
    req.body.rooms.forEach((room) => validateRoom(room))
    next()
  } catch (error) {
    next(error)
  }
}
