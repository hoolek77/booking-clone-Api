const { ForbiddenError } = require('../helpers/apiError')

const isUserVerified = (req, res, next) => {
  try {
    if (!req.user.isVerified) {
      throw new ForbiddenError('User is not verified.')
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = isUserVerified
