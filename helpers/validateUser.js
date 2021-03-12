const { UnauthorizedError } = require('./apiError')

const validateUser = (req) => {
  const user = req.user

  if (!user) {
    throw new UnauthorizedError('User not found.')
  }

  return user
}

module.exports = validateUser
