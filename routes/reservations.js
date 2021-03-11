const express = require('express')

const validateCreateReservationData = require('../middleware/validateCreateReservation')
const reservationController = require('../controllers/reservationsController')

const router = express.Router()

// take all reservations for logged in user / hotel owner
router.get('/getAllReservations', async (req, res, next) => {
  reservationController.getReservations(req, res, next)
})

// add new reservation
// query: startDate | endDate
router.post(
  '/createReservation',
  validateCreateReservationData,
  async (req, res, next) => {
    reservationController.saveReservation(req, res, next)
  }
)

// cancel reservation
router.delete('/removeReservation/:id', async (req, res, next) => {
  reservationController.cancelReservation(req, res, next)
})

// pay for reservation
router.put('/payForReservation/:id', async (req, res, next) => {
  reservationController.updatePayment(req, res, next)
})

module.exports = router
