const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const {
  getUsers,
  getHotelOwners,
  acceptUserToOwner,
  deleteOwner,
  deleteUser,
  deleteUsers,
  deleteHotel,
  verifyOwner,
} = require('../services/adminService')

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getUsers(USER_ROLE, HOTEL_OWNER_ROLE)
    res.status(200).send(users)
  } catch (error) {
    next(new ApiError(400, 'Users data cannot be fetched.'))
  }
}

exports.getHotelOwners = async (req, res, next) => {
  try {
    const owners = await getHotelOwners()
    res.status(200).send(owners)
  } catch (error) {
    next(new ApiError(400, 'Owners data cannot be fetched.'))
  }
}

exports.acceptUserToOwner = async (req, res, next) => {
  try {
    await acceptUserToOwner(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(400, 'User not found'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}

exports.deleteOwner = async (req, res, next) => {
  try {
    await deleteOwner(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(400, 'User not found'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}

exports.deleteUsers = async (req, res, next) => {
  try {
    const { forceDelete } = req.query
    const isForceDelete = forceDelete === 'true'
    await deleteUsers(req.body, isForceDelete)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}

exports.deleteHotel = async (req, res, next) => {
  try {
    const { forceDelete } = req.query
    const isForceDelete = forceDelete === 'true'
    await deleteHotel(req.params.id, isForceDelete)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Hotel not found'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}

exports.verifyOwner = async (req, res, next) => {
  try {
    await verifyOwner(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}
