const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const User = require('../models/user')

const userNotFoundError = () => new ApiError(404, 'User not found.')

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById('test').select('-password -__v')

    if (!user) {
      throw userNotFoundError()
    }

    res.json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(userNotFoundError())
    }

    next(new ApiError(400, 'User data cannot be fetched.'))
  }
}
