const mongoose = require('mongoose')
const express = require('express')
const { Hotel, validate } = require('../models/hotel')
const { Reservation } = require('../schemas/reservationSchema')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/hotels', async (req, res) => {
  const hotel = await Hotel.find()

  res.status(200).send(hotel)
})

router.post('/hotel', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let hotel = new Hotel({
    ownerId: req.body.ownerId,
    localization: req.body.localization,
    phoneNumber: req.body.phoneNumber,
    name: req.body.name,
    clientsRates: null,
    email: req.body.email,
    description: req.body.description,
    rooms: [req.body.rooms],
  })

  await hotel.save()

  res.status(200).send(hotel)
})

router.put('/hotel/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const hotel = await Hotel.findByIdAndUpdate(req.params.id, {
    ownerId: req.body.ownerId,
    localization: req.body.localization,
    phoneNumber: req.body.phoneNumber,
    name: req.body.name,
    clientsRates: null,
    email: req.body.email,
    description: req.body.description,
    rooms: [req.body.rooms],
  })

  if (!hotel) {
    return res.status(404).send('Hotel with given ID was not found')
  }
  res.status.send(hotel)
})

router.delete('/hotel/:id', async (req, res) => {
  const id = req.params.id
  try {
    const reservation = await Reservation.find({ hotelId: id })

    if (reservation) return res.status(409).send('Remove reservations')

    await Hotel.findByIdAndDelete(id)
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/reservation/:id', async (req, res) => {
  const id = req.params.id
  try {
    const reservation = await Reservation.findByIdAndDelete(id)
    if (!reservation) {
      return res.status(404).send('Reservation with given ID was not found')
    }

    const startDate = new Date(reservation.startDate)
    const currentDate = new Date('<YYYY-mm-ddTHH:MM:ssZ>')

    const msPerDay = 1000 * 60 * 60 * 24
    const msBetween = startDate.getTime() - currentDate.getTime()
    const days = Math.floor(msBetween / msPerDay)

    if (reservation.isPaid || days <= 3) {
      return res
        .status(404)
        .send(
          'Can not delete reservation; reservation is paid or the reservation is for three days or less'
        )
    }

    res.status(200).send('Reservation deleted')
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

module.exports = router
