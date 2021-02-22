const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/register', async (req, res) => {
  authController.register(req, res)
})

router.post('/login', async (req, res) => {
  authController.login(req, res)
})

module.exports = router
