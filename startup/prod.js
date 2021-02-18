const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')

module.exports = function (app) {
  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(mongoSanitize())
  app.use(xssClean())
  app.use(hpp())
}
