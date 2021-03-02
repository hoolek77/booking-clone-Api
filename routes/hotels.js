const express = require('express')
const hotelController = require('../controllers/hotelsController')
const router = express.Router()
const hotelsController = require('../controllers/hotelsController')

router.get('/', async (req, res, next) => {
  hotelController.getHotels(req, res, next)
})

router.get('/:limit', async (req, res, next) => {
  hotelController.getLimitedHotels(req, res, next)
})

router.get('/hotel/:hotelId', async (req, res, next) => {
  hotelController.getHotel(req, res, next)
})

router.get('/city/:city', async (req, res, next) => {
  hotelController.getHotelsByCity(req, res, next)
})

router.get('/free/:hotelId', async (req, res, next) => {
  hotelsController.getFreeRooms(req, res, next)
})

module.exports = router
