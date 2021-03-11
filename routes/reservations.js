const express = require('express')

const validateCreateReservationData = require('../middleware/validateCreateReservation')
const reservationController = require('../controllers/reservationsController')

const router = express.Router()

// take all reservations for logged in user / hotel owner
router.get('', async (req, res, next) => {
  reservationController.getReservations(req, res, next)
})

// add new reservation
// query: startDate | endDate
router.post('', validateCreateReservationData, async (req, res, next) => {
  reservationController.saveReservation(req, res, next)
})

// cancel reservation
router.delete('/:id', async (req, res, next) => {
  reservationController.cancelReservation(req, res, next)
})

// pay for reservation
router.put('/pay/:id', async (req, res, next) => {
  reservationController.updatePayment(req, res, next)
})

module.exports = router
