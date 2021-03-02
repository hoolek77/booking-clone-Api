const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/', async (req, res, next) => {
  adminController.getUsers(req, res, next)
})

router.get('/owners', async (req, res, next) => {
  adminController.getHotelOwners(req, res, next)
})

router.put('/owner/accept/:email', async (req, res, next) => {
  adminController.acceptOwnersEmail(req, res, next)
})

router.delete('/owner/:email', async (req, res, next) => {
  adminController.deleteOwner(req, res, next)
})

router.delete('/:email', async (req, res) => {
  adminController.deleteUser(req, res, next)
})

module.exports = router
