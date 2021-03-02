const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { validate } = require('../models/reservation')
const {
  getReservations,
  addReservation,
  updatePayment,
} = require('../services/reservationsService')

exports.getReservations = async (req, res, next) => {
  try {
    const reservations = await getReservations()
    res.status(200).send(reservations)
  } catch (error) {
    next(new ApiError(400, 'Reservations data cannot be fetched.'))
  }
}

exports.addReservation = async (req, res, next) => {
  try {
    const reservation = await addReservation(req.body)
    res.status(200).send(reservation)
  } catch (error) {
    next(new ApiError(400, 'Reservation data cannot be fetched.'))
  }
}

exports.updatePayment = async (req, res, next) => {
  try {
    const reservation = updatePayment(req.params.id)
    res.status(200).send(reservation)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Reservation not found.'))
    }

    next(new ApiError(400, 'Reservation data cannot be fetched.'))
  }
}
