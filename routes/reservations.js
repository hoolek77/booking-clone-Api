const express = require('express')
const { Reservation, validate } = require('../models/reservation')
const ApiError = require('../helpers/apiError')
const router = express.Router()
const reservationController = require('../controllers/reservationsController')

router.get('/', async (req, res, next) => {
  reservationController.getReservations(req, res, next)
})

router.post('/', async (req, res, next) => {
  reservationController.addReservation(req, res, next)
})

router.put('/payment/:id', async (req, res, next) => {
  reservationController.updatePayment(req, res, next)
})

module.exports = router
