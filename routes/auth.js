const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/register', (req, res, next) => {
  authController.register(req, res, next)
})

router.post('/login', (req, res, next) => {
  authController.login(req, res, next)
})

module.exports = router
