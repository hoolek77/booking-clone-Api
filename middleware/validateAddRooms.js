const validateRoom = require('../validations/room')

module.exports = function validateAddRooms(req, res, next) {
  try {
    req.body.forEach((room) => validateRoom(room))
    next()
  } catch (error) {
    next(error)
  }
}
