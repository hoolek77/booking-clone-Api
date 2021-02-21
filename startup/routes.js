const express = require('express')
const rateLimit = require('express-rate-limit')

const ApiError = require('../helpers/apiError')
const globalErrorHandler = require('../middleware/globalErrorHandler')

const example = require('../routes/example')
const hotels = require('../routes/hotels')

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests',
})

module.exports = function (app) {
  app.use(express.json())

  app.use('/api', limit)
  app.use('/api/v1/users', example)
  app.use('/api/hotels', hotels)

  app.use('*', (req, res, next) => {
    next(new ApiError(404, 'Route is not supported.'), req, res, next)
  })

  app.use(globalErrorHandler)
}
