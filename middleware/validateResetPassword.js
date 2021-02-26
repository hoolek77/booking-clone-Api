const validateResetPasswordData = require('../validations/resetPassword')

module.exports = function validateResetPassword(req, res, next) {
  try {
    req.body = validateResetPasswordData(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
