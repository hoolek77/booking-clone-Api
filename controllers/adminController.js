const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const {
  getUsers,
  getHotelOwners,
  acceptOwnersEmail,
  deleteOwner,
  deleteUser,
} = require('../services/adminService')

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getUsers()
    res.status(200).send(users)
  } catch (error) {
    next(new ApiError(400, 'Users data cannot be fetched.'))
  }
}

exports.getHotelOwners = async (req, res, next) => {
  try {
    const owners = await getHotelOwners(HOTEL_OWNER_ROLE)
    res.status(200).send(owners)
  } catch (error) {
    next(new ApiError(400, 'Owners data cannot be fetched.'))
  }
}

exports.acceptOwnersEmail = async (req, res, next) => {
  try {
    await acceptOwnersEmail(req.params.email, HOTEL_OWNER_ROLE)
    res.status(200).json({ message: 'Done' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found'))
    }

    next(new ApiError(400, 'User data cannot be fetched'))
  }
}

exports.deleteOwner = async (req, res, next) => {
  try {
    const owner = await deleteOwner(req.params.email, HOTEL_OWNER_ROLE)
    res.status(200).send(owner)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found'))
    }

    next(new ApiError(400, 'Owner data cannot be fetched'))
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.email, USER_ROLE)
    res.status(200).send(user)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'User not found'))
    }

    next(new ApiError(400, 'User data cannot be fetched'))
  }
}
