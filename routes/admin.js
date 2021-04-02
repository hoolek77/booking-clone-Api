const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

// get all users and hotel owners
router.get('/users', async (req, res, next) => {
  adminController.getUsers(req, res, next)
})

// add new city
router.post('/city', async (req, res, next) => {
  adminController.addCity(req, res, next)
})

// get all hotel owners
router.get('/hotelOwners', async (req, res, next) => {
  adminController.getHotelOwners(req, res, next)
})

// change user role to hotel owner
router.put('/acceptUserToHotelOwner/:id', async (req, res, next) => {
  adminController.acceptUserToOwner(req, res, next)
})

// verify owner
router.put('/verifyHotelOwner/:id', async (req, res, next) => {
  adminController.verifyOwner(req, res, next)
})

// remove owner
router.delete('/hotelOwner/:id', async (req, res, next) => {
  adminController.deleteOwner(req, res, next)
})

// remove user
router.delete('/users/:id', async (req, res, next) => {
  adminController.deleteUser(req, res, next)
})

// remove many users
// query: forceDelete
router.delete('/users', async (req, res, next) => {
  adminController.deleteUsers(req, res, next)
})

// remove hotel
// query: forceDelete
router.delete('/hotels/:id', async (req, res, next) => {
  adminController.deleteHotel(req, res, next)
})

module.exports = router
