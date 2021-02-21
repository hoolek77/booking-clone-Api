const mongoose = require('mongoose')
const express = require('express')
const { Hotel } = require('../models/hotel')
const router = express.Router()

router.get('/', (req, res) => {
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

router.get('/:limit', (req, res) => {
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

router.get('/hotel/:hotelId', (req, res) => {
  Hotel.findById(req.params.hotelId)
    .exec()
    .then((hotel) => {
      if (!hotel) {
        res.status(404).json({ message: 'Hotel not found' })
      }
      res.status(200).json({ hotel: hotel })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

router.get('/city/:city', (req, res) => {
  Hotel.find()
    .where('localization.city', req.params.city)
    .then((hotel) => {
      if (!hotel) {
        res.status(404).json({ message: 'Hotels not found' })
      }
      res.status(200).json({ hotel: hotel })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})
