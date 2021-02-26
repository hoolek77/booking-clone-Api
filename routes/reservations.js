const mongoose = require('mongoose')
const express = require('express')
const { Reservation, validate } = require('../models/reservation')
const ApiError = require('../helpers/apiError')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/', async (req, res) => {
  const reservations = await Reservation.find()

  res.send(reservations)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) throw new ApiError(400, error.details[0].message)

  let reservation = new Reservation(req.body)

  await reservation.save()

  res.send(reservation)
})

router.put('/payment/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
      },
      { new: true }
    )

    res.send(reservation)
  } catch {
    throw new ApiError(404, 'Reservation with the gived ID was not found.')
  }
})

module.exports = router
