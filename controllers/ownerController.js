const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const {
  addRoom,
  getHotels,
  addHotel,
  updateHotel,
  deleteHotel,
  deleteReservation,
} = require('../services/ownerService')

exports.addRoom = async (req, res, next) => {
  try {
    const hotel = await addRoom(req)
    res.status(200).send(hotel)
  } catch (error) {
    next(new ApiError(400, 'Can not add a room.'))
  }
}

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await getHotels(req.user._id)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotel data cannot be fetched.'))
  }
}

exports.addHotel = async (req, res, next) => {
  try {
    req.body.ownerId = req.user._id
    const hotel = await addHotel(req.body)
    res.status(200).send(hotel)
  } catch (error) {
    next(new ApiError(400, error.message))
  }
}

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await updateHotel(req.params.id, req.body)
    res.status(200).send(hotel)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Hotel not found.'))
    }

    next(new ApiError(400, 'Hotel data cannot be fetched.'))
  }
}

exports.deleteHotel = async (req, res, next) => {
  try {
    const { forceDelete } = req.query
    const isForceDelete = forceDelete === 'true'
    await deleteHotel(req.user._id, req.params.id, isForceDelete)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(404, 'Hotel with given ID does not exist'))
    }
    next(new ApiError(error.statusCode, error.message))
  }
}

exports.deleteReservation = async (req, res, next) => {
  try {
    deleteReservation(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Reservation not found.'))
    }

    next(new ApiError(400, 'Reservation data cannot be fetched.'))
  }
}
