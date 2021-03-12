const validateUser = require('../helpers/validateUser')

exports.getUser = (req, res, next) => {
  try {
    return res.json(validateUser(req))
  } catch (error) {
    next(error)
  }
}
