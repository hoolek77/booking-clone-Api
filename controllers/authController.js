const {
  register,
  login,
  requestPasswordReset,
  resetPassword,
} = require('../services/authService')

const responseWithToken = (res, data) => {
  return res.header('X-Auth-Token', data.token).json(data)
}

exports.register = async (req, res, next) => {
  try {
    const data = await register(req.body)
    return responseWithToken(res, data)
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const data = await login(req.body)
    return responseWithToken(res, data)
  } catch (error) {
    next(error)
  }
}

exports.resetPasswordRequest = async (req, res, next) => {
  try {
    const success = await requestPasswordReset(req.body.email)
    return res.json({ success })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, token, password } = req.body
    const success = await resetPassword(userId, token, password)
    return res.json({ success })
  } catch (error) {
    next(error)
  }
}
