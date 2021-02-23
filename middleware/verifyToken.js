const jwt = require('jsonwebtoken')
const config = require('config')

const verifyToken = (req, res, next) => {
  const token = req.header('X-Auth-Token')

  if (!token) {
    return res.status(401).json({ error: 'Access denied.' })
  }

  try {
    const expiresIn = 60 * 60
    const options = { expiresIn }
    const secret = config.get('jwtPrivateKey')
    const result = jwt.verify(token, secret, options)

    if (result) {
      req.userId = result.userId
    }

    next()
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' })
  }
}

module.exports = verifyToken
