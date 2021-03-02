const express = require('express')
const ownerController = require('../controllers/ownerController')
const router = express.Router()
const { isHotelOwner } = require('../middleware/role')

router.get('/hotels', isHotelOwner, async (req, res, next) => {
  ownerController.getHotels(req, res, next)
})

router.post('/hotel', isHotelOwner, async (req, res, next) => {
  ownerController.addHotel(req, res, next)
})

router.put('/hotel/:id', isHotelOwner, async (req, res, next) => {
  ownerController.updateHotel(req, res, next)
})

router.delete('/hotel/:id', isHotelOwner, async (req, res, next) => {
  ownerController.deleteHotel(req, res, next)
})

router.delete('/reservation/:id', isHotelOwner, async (req, res, next) => {
  ownerController.deleteReservation(req, res, next)
})

module.exports = router
