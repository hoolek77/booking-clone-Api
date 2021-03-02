const express = require('express')
const rateLimit = require('express-rate-limit')

const bodyParser = require('body-parser')

const ApiError = require('../helpers/apiError')
const globalErrorHandler = require('../middleware/globalErrorHandler')
const verifyToken = require('../middleware/verifyToken')
const { isAdmin, isHotelOwner } = require('../middleware/role')

const reservations = require('../routes/reservations')
const hotels = require('../routes/hotels')
const owner = require('../routes/owner')
const auth = require('../routes/auth')
const user = require('../routes/user')
const admin = require('../routes/admin')

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests',
})

module.exports = function (app) {
  app.use(express.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Autorization'
    )
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
      return res.status(200).json({})
    }
    next()
  })

  app.use('/api', limit)
  app.use('/api/reservations', verifyToken, reservations)
  app.use('/api/hotels', hotels)
  app.use('/api/owner', verifyToken, isHotelOwner, owner)
  app.use('/api/auth', auth)
  app.use('/api/user', verifyToken, user)
  app.use('/api/admin', isAdmin, admin)

  app.use('*', (req, res, next) => {
    next(new ApiError(404, 'Route is not supported.'), req, res, next)
  })

  app.use(globalErrorHandler)
}
