const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

// get all users and hotel owners
router.get('/getAllUsers', async (req, res, next) => {
  adminController.getUsers(req, res, next)
})

// get all hotel owners
router.get('/getAllOwners', async (req, res, next) => {
  adminController.getHotelOwners(req, res, next)
})

// change user role to hotel owner
router.put('/acceptUserToOwner/:id', async (req, res, next) => {
  adminController.acceptUserToOwner(req, res, next)
})

// verify owner
router.put('/verifyOwner/:id', async (req, res, next) => {
  adminController.verifyOwner(req, res, next)
})

// remove owner
router.delete('/deleteOwner/:id', async (req, res, next) => {
  adminController.deleteOwner(req, res, next)
})

// remove user
router.delete('/deleteUser/:id', async (req, res, next) => {
  adminController.deleteUser(req, res, next)
})

// remove many users
// query: forceDelete
router.post('/deleteManyUsers', async (req, res, next) => {
  adminController.deleteUsers(req, res, next)
})

// remove hotel
// query: forceDelete
router.delete('/deleteHotel/:id', async (req, res, next) => {
  adminController.deleteHotel(req, res, next)
})

module.exports = router
