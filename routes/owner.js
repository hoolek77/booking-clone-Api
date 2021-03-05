const express = require('express')
const ownerController = require('../controllers/ownerController')
const router = express.Router()
const validateAddHotel = require('../middleware/validateAddHotel')
const validateAddRooms = require('../middleware/validateAddRooms')
const validateEditHotel = require('../middleware/validateEditHotel')

router.get('/hotels', async (req, res, next) => {
  ownerController.getHotels(req, res, next)
})

router.post('/hotel', validateAddHotel, async (req, res, next) => {
  ownerController.addHotel(req, res, next)
})

router.put('/hotel/:id', validateEditHotel, async (req, res, next) => {
  ownerController.updateHotel(req, res, next)
})

router.delete('/hotel/:id', async (req, res, next) => {
  ownerController.deleteHotel(req, res, next)
})

router.post('/rooms/:hotelId', validateAddRooms, async (req, res, next) => {
  ownerController.addRoom(req, res, next)
})

module.exports = router
