const { ForbiddenError } = require('../helpers/apiError')
const { ADMIN_ROLE, HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const validateUser = require('../helpers/validateUser')

const hasUserAccess = (req, next, role) => {
  try {
    const user = validateUser(req)

    if (user.role === HOTEL_OWNER_ROLE && !user.isVerified) {
      throw new ApiError(403, 'Hotel owner is not verified yet.')
    }

    if (user.role === role) {
      next()
      return
    }

    throw new ForbiddenError('Access denied.')
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
