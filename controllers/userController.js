const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { getUser } = require('../services/userService')

exports.getUser = async (req, res, next) => {
  try {
    const user = await getUser(req.userId)
    res.json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found.'))
    }

    next(new ApiError(400, 'User data cannot be fetched.'))
  }
}
