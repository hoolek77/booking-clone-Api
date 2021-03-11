const express = require('express')
const hotelController = require('../controllers/hotelsController')
const router = express.Router()
const hotelsController = require('../controllers/hotelsController')

// query: pageNumber | pageSize
router.get('', async (req, res, next) => {
  hotelController.getHotels(req, res, next)
})

// get limited amount of hotels
router.get('/getLimitedHotels/:limit', async (req, res, next) => {
  hotelController.getLimitedHotels(req, res, next)
})

// get hotel by id
router.get('/:id', async (req, res, next) => {
  hotelController.getHotel(req, res, next)
})

// get hotel by city name
router.get('/getHotelsByCity/:city', async (req, res, next) => {
  hotelController.getHotelsByCity(req, res, next)
})

// query: startDate | endDate
router.get('/:id/freeRooms', async (req, res, next) => {
  hotelsController.getFreeRooms(req, res, next)
})

module.exports = router
