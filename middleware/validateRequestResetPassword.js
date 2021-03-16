const validateRequestResetPasswordData = require('../validations/requestResetPassword')

module.exports = function validateRequestResetPassword(req, res, next) {
  try {
    req.body = validateRequestResetPasswordData(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
