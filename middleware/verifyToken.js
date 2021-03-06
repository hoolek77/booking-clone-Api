const jwt = require('jsonwebtoken')
const config = require('config')
const { getUser } = require('../services/userService')

const verifyToken = async (req, res, next) => {
  const token = req.header('X-Auth-Token')

  if (!token) {
    return res.status(401).json({ message: 'Access denied.' })
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
    res.status(400).json({ message: 'Invalid token.' })
  }
}

module.exports = verifyToken
