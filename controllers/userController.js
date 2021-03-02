const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { getUser } = require('../services/userService')

exports.getUser = async (req, res, next) => {
  if (req.user) {
    return res.json(req.user)
  }

  next(new ApiError(400, 'User data cannot be fetched.'))
}
