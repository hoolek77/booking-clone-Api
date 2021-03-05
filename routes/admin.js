const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/users', async (req, res, next) => {
  adminController.getUsers(req, res, next)
})

router.get('/owners', async (req, res, next) => {
  adminController.getHotelOwners(req, res, next)
})

router.put('/owner/accept/:id', async (req, res, next) => {
  adminController.acceptUserToOwner(req, res, next)
})

router.put('/owner/status/:id', async (req, res, next) => {
  adminController.verifyOwner(req, res, next)
})

router.delete('/owner/:id', async (req, res, next) => {
  adminController.deleteOwner(req, res, next)
})

router.delete('/user/:id', async (req, res, next) => {
  adminController.deleteUser(req, res, next)
})

router.post('/users/delete', async (req, res, next) => {
  adminController.deleteUsers(req, res, next)
})

router.delete('/hotel/:id', async (req, res, next) => {
  adminController.deleteHotel(req, res, next)
})

module.exports = router
