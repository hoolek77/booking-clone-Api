const express = require('express')
const router = express.Router()
const validateCreateUser = require('../validations/createUser')
const validateLoginUser = require('../validations/loginUser')
const authController = require('../controllers/auth')

router.post('/register', validateCreateUser, (req, res, next) => {
  authController.register(req, res, next)
})

router.post('/login', validateLoginUser, (req, res, next) => {
  authController.login(req, res, next)
})

module.exports = router
