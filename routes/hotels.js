const express = require('express')
const hotelController = require('../controllers/hotelsController')
const router = express.Router()
const hotelsController = require('../controllers/hotelsController')

// query: pageNumber | pageSize | city | adults | children | startDate | endDate
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

// query: startDate | endDate | adults | children
router.get('/:id/availableRooms', async (req, res, next) => {
  hotelsController.getAvailableHotelRooms(req, res, next)
})

module.exports = router
