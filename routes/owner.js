const mongoose = require('mongoose')
const express = require('express')
const { Hotel, validate } = require('../models/hotel')
const { Reservation } = require('../schemas/reservationSchema')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/hotels', (req, res) => {
  Hotel.find()
    .limit(req.params.limit)
    .exec()
    .then((hotel) => {
      if (!hotel) {
        res.status(404).json({ message: 'No hotels in database' })
      }
      res.status(200).json({ hotel: hotel })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

router.post('/hotel', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).json({ error: error })

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

  res.send(hotel)
})

router.put('/hotel/:id', async (req, res) => {
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
  res.send(hotel)
})

router.delete('/hotel/:id', (req, res) => {
  Reservation.findById({ hotelId: req.params.id })
    .exec()
    .then((reservation) => {
      if (reservation.length > 0) {
        return res.status(409).json({
          message: 'This hotel has reservations, removal not possible',
        })
      } else {
        Hotel.deleteOne({ _id: req.params.id })
          .exec()
          .then(() => {
            res.status(200).json({ message: 'Hotel deleted' })
          })
          .catch((err) => {
            res.status(500).json({ error: err })
          })
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

router.delete('/reservation/:id', (req, res) => {
  Reservation.deleteOne()
    .exec()
    .then((reservation) => {
      const startDate = new Date(reservation.startDate)
      const currentDate = new Date('<YYYY-mm-ddTHH:MM:ssZ>')

      const msPerDay = 1000 * 60 * 60 * 24
      const msBetween = startDate.getTime() - currentDate.getTime()
      const days = Math.floor(msBetween / msPerDay)

      if (reservation.isPaid || days <= 3) {
        return res.status(404).json({
          message:
            'Can not delete reservation; reservation is paid or the reservation is for three days or less',
        })
      } else {
        res.status(200).json({ message: 'reservation deleted' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

module.exports = router
