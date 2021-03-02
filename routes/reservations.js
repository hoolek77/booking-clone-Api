const express = require('express')
const reservationController = require('../controllers/reservationsController')

const router = express.Router()

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
