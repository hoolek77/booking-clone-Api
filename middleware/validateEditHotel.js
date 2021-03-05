const validateAddHotelData = require('../validations/editHotel')
const validateAddressData = require('../validations/addressNotRequired')
const validateRoom = require('../validations/roomNotRequired')

module.exports = function validateAddHotel(req, res, next) {
  try {
    req.body = validateAddHotelData(req.body)
    if (req.body.localization) {
      req.body.localization = validateAddressData(req.body.localization)
    }
    if (req.body.rooms) {
      req.body.rooms.forEach((room) => validateRoom(room))
    }
    next()
  } catch (error) {
    next(error)
  }
}
