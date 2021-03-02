const ApiError = require('../helpers/apiError')
const { ADMIN_ROLE, HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const getUserFromRequest = require('../helpers/getUserFromRequest')

const hasUserAccess = (req, next, role) => {
  try {
    const user = getUserFromRequest(req)

    if (user.role === role) {
      next()
      return
    }

    throw new ApiError(403, 'Access denied.')
  } catch (error) {
    next(error)
  }
}

const isAdmin = (req, res, next) => {
  hasUserAccess(req, next, ADMIN_ROLE)
}

const isHotelOwner = (req, res, next) => {
  hasUserAccess(req, next, HOTEL_OWNER_ROLE)
}

const isUser = (req, res, next) => {
  hasUserAccess(req, next, USER_ROLE)
}

module.exports = {
  isAdmin,
  isHotelOwner,
  isUser,
}
