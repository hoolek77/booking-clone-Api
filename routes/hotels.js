const mongoose = require('mongoose')
const express = require('express')
const { Hotel } = require('../models/hotel')
const ApiError = require('../helpers/apiError')
const router = express.Router()

router.get('/', async (req, res) => {
  const hotels = await Hotel.find()

  res.status(200).send(hotels)
})

router.get('/:limit', async (req, res) => {
  const limit = parseInt(req.params.limit)
  const hotels = await Hotel.find().limit(limit)

  res.status(200).send(hotels)
})

router.get('/hotel/:hotelId', async (req, res) => {
  const id = req.params.hotelId
  const hotel = await Hotel.findById(id)

  if (!hotel) {
    throw new ApiError(404, 'Hotel with provided ID not found')
  }

  res.status(200).send(hotel)
})

router.get('/city/:city', async (req, res) => {
  const city = req.params.city
  const hotels = await Hotel.find({ localization: { city: city } })

  res.status(200).send(hotels)
})

module.exports = router
