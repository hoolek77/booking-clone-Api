const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// get self info
router.get('/me', (req, res, next) => {
  userController.getUser(req, res, next)
})

module.exports = router
