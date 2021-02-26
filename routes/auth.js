const express = require('express')
const router = express.Router()
const validateCreateUser = require('../middleware/validateCreateUser')
const validateLoginUser = require('../middleware/validateLoginUser')
const validateResetPassword = require('../middleware/validateResetPassword')
const authController = require('../controllers/auth')

router.post('/register', validateCreateUser, (req, res, next) => {
  authController.register(req, res, next)
})

router.post('/login', validateLoginUser, (req, res, next) => {
  authController.login(req, res, next)
})

router.post('/requestPasswordReset', (req, res, next) => {
  authController.resetPasswordRequest(req, res, next)
})

router.post('/resetPassword', validateResetPassword, (req, res, next) => {
  authController.resetPassword(req, res, next)
})

module.exports = router
