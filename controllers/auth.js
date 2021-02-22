const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

const User = require('../models/user')
const validateCreateUser = require('../validations/createUser')
const validateLoginUser = require('../validations/loginUser')

const createToken = (user) => {
  const expiresIn = 60 * 60 // one hour
  const options = { expiresIn }
  const secret = config.get('jwtPrivateKey')

  const payload = {
    userId: user._id,
  }

  return jwt.sign(payload, secret, options)
}

const responseWithToken = (res, user) => {
  const token = createToken(user)

  res.header('X-Auth-Token', token).json({
    error: null,
    data: {
      userId: user._id,
      userEmail: user.email,
    },
  })
}

exports.register = async (req, res) => {
  const { error } = validateCreateUser(req.body)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const isEmailExist = await User.findOne({ email: req.body.email })

  if (isEmailExist) {
    return res
      .status(400)
      .json({ error: 'An account with this email address already exists.' })
  }

  const user = new User(req.body)

  try {
    const savedUser = await user.save()
    responseWithToken(res, savedUser)
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.login = async (req, res) => {
  const { error } = validateLoginUser(req.body)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(400).json({ error: 'Email or password is wrong.' })
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password)

  if (!validPassword) {
    return res.status(400).json({ error: 'Email or password is wrong.' })
  }

  responseWithToken(res, user)
}
