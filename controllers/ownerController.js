const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { validate } = require('../models/hotel')
const {
  getHotels,
  addHotel,
  updateHotel,
  deleteHotel,
  deleteReservation,
} = require('../services/ownerService')

const JoiValidate = (data) => {
  const { error } = validate(data)
  if (error) throw new ApiError(400, error.details[0].message)
}

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await getHotels()
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotel data cannot be fetched.'))
  }
}

exports.addHotel = async (req, res, next) => {
  try {
    const hotel = addHotel(req.body)
    res.status(200).send(hotel)
  } catch (error) {
    next(new ApiError(400, 'Hotel data cannot be fetched.'))
  }
}

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = updateHotel(req.params.id, req.body)
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
    const hotels = deleteHotel(req.params.id, isForceDelete)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels data cannot be fetched.'))
  }
}

exports.deleteReservation = async (req, res, next) => {
  try {
    deleteReservation(req.params.id)
    res.status(200).json({ message: 'Reservation deleted' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Reservation not found.'))
    }

    next(new ApiError(400, 'Reservation data cannot be fetched.'))
  }
}
