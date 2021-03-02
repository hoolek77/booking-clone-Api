const express = require('express')

const validateCreateReservationData = require('../middleware/validateCreateReservation')
const reservationController = require('../controllers/reservationsController')

const router = express.Router()

router.get('/', async (req, res, next) => {
  reservationController.getReservations(req, res, next)
})

router.post('/', validateCreateReservationData, async (req, res, next) => {
  reservationController.saveReservation(req, res, next)
})

router.delete('/:id', async (req, res, next) => {
  reservationController.cancelReservation(req, res, next)
})

router.put('/payment/:id', async (req, res, next) => {
  reservationController.updatePayment(req, res, next)
})

module.exports = router
