const jwt = require('jsonwebtoken')
const config = require('config')
const { getUser } = require('../services/userService')
const { UnauthorizedError } = require('../helpers/apiError')

const verifyToken = async (req, res, next) => {
  const token = req.header('X-Auth-Token')

  if (!token) {
    return next(new UnauthorizedError('Access denied.'))
  }

  try {
    const expiresIn = 60 * 60
    const options = { expiresIn }
    const secret = config.get('jwtPrivateKey')
    const result = jwt.verify(token, secret, options)

    if (result) {
      req.user = await getUser(result.userId)
    }

    next()
  } catch (err) {
    next(new UnauthorizedError('Invalid token.'))
  }
}

module.exports = verifyToken
