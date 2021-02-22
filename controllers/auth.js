const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

const User = require('../models/user')
const validateCreateUser = require('../validations/createUser')
const validateLoginUser = require('../validations/loginUser')
const ApiError = require('../helpers/apiError')

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

exports.register = async (req, res, next) => {
  try {
    const { error } = validateCreateUser(req.body)

    if (error) {
      throw new ApiError(400, error.details[0].message)
    }

    const isEmailExist = await User.findOne({ email: req.body.email })

    if (isEmailExist) {
      throw new ApiError(400, 'Account with this email address already exists.')
    }

    const user = new User(req.body)

    const savedUser = await user.save()
    responseWithToken(res, savedUser)
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { error } = validateLoginUser(req.body)

    if (error) {
      throw new ApiError(400, error.details[0].message)
    }

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      throw new ApiError(400, 'Email or password is wrong.')
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
      throw new ApiError(400, 'Email or password is wrong.')
    }

    responseWithToken(res, user)
  } catch (error) {
    next(error)
  }
}
