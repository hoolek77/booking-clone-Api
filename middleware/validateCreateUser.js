const validateCreateUserData = require('../validations/createUser')

module.exports = function validateCreateUser(req, res, next) {
  try {
    req.body = validateCreateUserData(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
