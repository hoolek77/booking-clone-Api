const User = require('../models/user')

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password -__v')

    res.json(user)
  } catch (error) {
    next(error)
  }
}
