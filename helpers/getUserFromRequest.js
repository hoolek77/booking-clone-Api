const ApiError = require('../helpers/apiError')

const getUserFromRequest = (req) => {
  const user = req.user

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  return user
}

module.exports = getUserFromRequest
