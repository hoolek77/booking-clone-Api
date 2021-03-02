const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const User = require('../models/user')

exports.getUser = async (userId) => {
  const user = await User.findById(userId).select('-password -__v')

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  return user
}
