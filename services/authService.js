const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const config = require('config')
const User = require('../models/user')
const Token = require('../models/token')
const ApiError = require('../helpers/apiError')
const { notifyUser } = require('./notifyUser')

const salt = +process.env.BCRYPT_SALT || 10

const createToken = (user) => {
  const expiresIn = 60 * 60 // one hour
  const options = { expiresIn }
  const secret = config.get('jwtPrivateKey')

  const payload = {
    userId: user._id,
  }

  return jwt.sign(payload, secret, options)
}

const register = async (data) => {
  let user = await User.findOne({ email: data.email })

  if (user) {
    throw new ApiError(400, 'Account with this email address already exists.')
  }

  user = new User(data)
  await user.save()

  notifyUser(
    user.isSmsAllowed,
    user.email,
    'Welcome to BookingCloneApi',
    'reg',
    user.firstName,
    null,
    'BookingCloneApi',
    user.phoneNumber,
    'You successfuly registered to BookingCloneApi'
  )
  return {
    userId: user._id,
    token: createToken(user),
  }
}

const login = async (data) => {
  const user = await User.findOne({ email: data.email })

  if (!user) {
    throw new ApiError(400, 'Email or password is wrong.')
  }

  const validPassword = await bcrypt.compare(data.password, user.password)

  if (!validPassword) {
    throw new ApiError(400, 'Email or password is wrong.')
  }

  return {
    userId: user._id,
    token: createToken(user),
  }
}

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, 'User does not exist.')
  }

  let token = await Token.findOne({ userId: user._id })

  if (token) {
    await token.deleteOne()
  }

  let resetToken = crypto.randomBytes(32).toString('hex')
  const hash = await bcrypt.hash(resetToken, Number(salt))

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save()

  const clientUrl = config.get('clientUrl')
  const link = `${clientUrl}/passwordReset?token=${resetToken}&id=${user._id}`

  // send email to user with the link

  return true
}

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId })

  if (!passwordResetToken) {
    throw new ApiError(400, 'Invalid or expired password reset token.')
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token)

  if (!isValid) {
    throw new ApiError(400, 'Invalid or expired password reset token.')
  }

  const hash = await bcrypt.hash(password, Number(salt))

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  )

  const user = await User.findById({ _id: userId })

  // send email to user that password was reseted

  await passwordResetToken.deleteOne()

  return true
}

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
}
