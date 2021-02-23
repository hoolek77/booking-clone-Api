const mongoose = require('mongoose')
const express = require('express')
const { Reservation, validate } = require('../models/reservation')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/', async (req, res) => {
  const reservations = await Reservation.find()

  res.send(reservations)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

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
    return res
      .status(404)
      .json({ messaage: 'Reservation with the gived ID was not found.' })
  }
})

module.exports = router
