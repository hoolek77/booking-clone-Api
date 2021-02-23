const ApiError = require('../helpers/apiError')
const { ADMIN_ROLE, HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const User = require('../models/user')

const findUser = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  return user
}

const hasUserAccess = async (req, next, role) => {
  try {
    const user = await findUser(req.userId)

    if (user.role === role) {
      next()
      return
    }

    throw new ApiError(403, 'Access denied.')
  } catch (error) {
    next(error)
  }
}

const isAdmin = async (req, res, next) => {
  hasUserAccess(req, next, ADMIN_ROLE)
}

const isHotelOwner = async (req, res, next) => {
  hasUserAccess(req, next, HOTEL_OWNER_ROLE)
}

const isUser = async (req, res, next) => {
  hasUserAccess(req, next, USER_ROLE)
}

module.exports = {
  isAdmin,
  isHotelOwner,
  isUser,
}
