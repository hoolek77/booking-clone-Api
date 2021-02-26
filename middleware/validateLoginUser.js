const validateLoginUserData = require('../validations/loginUser')

module.exports = function validateLoginUser(req, res, next) {
  try {
    req.body = validateLoginUserData(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
