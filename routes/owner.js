const express = require('express')
const ownerController = require('../controllers/ownerController')
const router = express.Router()
const validateAddHotel = require('../middleware/validateAddHotel')
const validateAddRooms = require('../middleware/validateAddRooms')
const validateEditHotel = require('../middleware/validateEditHotel')

// get all hotels for hotel owner
router.get('/getAllHotels', async (req, res, next) => {
  ownerController.getHotels(req, res, next)
})

// add new hotel
router.post('/addHotel', validateAddHotel, async (req, res, next) => {
  ownerController.addHotel(req, res, next)
})

// update hotel
router.put('/updateHotel/:id', validateEditHotel, async (req, res, next) => {
  ownerController.updateHotel(req, res, next)
})

// remove hotel
// query: forceDelete
router.delete('/removeHotel/:id', async (req, res, next) => {
  ownerController.deleteHotel(req, res, next)
})

// add room to a hotel
router.post('/addRoomToHotel/:hotelId', validateAddRooms, async (req, res, next) => {
  ownerController.addRoom(req, res, next)
})

module.exports = router
