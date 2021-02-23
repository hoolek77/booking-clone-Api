const express = require('express')
const rateLimit = require('express-rate-limit')

const ApiError = require('../helpers/apiError')
const globalErrorHandler = require('../middleware/globalErrorHandler')
const verifyToken = require('../middleware/verifyToken')

const auth = require('../routes/auth')
const user = require('../routes/user')

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests',
})

module.exports = function (app) {
  app.use(express.json())

  app.use('/api', limit)
  app.use('/api/auth', auth)
  app.use('/api/user', verifyToken, user)

  app.use('*', (req, res, next) => {
    next(new ApiError(404, 'Route is not supported.'), req, res, next)
  })

  app.use(globalErrorHandler)
}
