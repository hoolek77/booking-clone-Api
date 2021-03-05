const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const {
  getFreeRooms,
  getHotels,
  getHotel,
  getLimitedHotels,
  getHotelsByCity,
} = require('../services/hotelsService')

exports.getFreeRooms = async (req, res, next) => {
  try {
    const freeRooms = await getFreeRooms(req)
    res.status(200).send(freeRooms)
  } catch (error) {
    next(new ApiError(400, 'Free room data can not be fetched.'))
  }
}

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await getHotels(req)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels cannot be fetched'))
  }
}

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await getHotel(req.params.hotelId)
    res.status(200).send(hotel)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Hotel with provided ID not found'))
    }
    next(new ApiError(400, 'Hotel cannot be fetched'))
  }
}

exports.getLimitedHotels = async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit)
    const hotels = await getLimitedHotels(limit)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels cannot be fetched'))
  }
}

exports.getHotelsByCity = async (req, res, next) => {
  try {
    const hotels = await getHotelsByCity(req.params.city)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels cannot be fetched'))
  }
}
