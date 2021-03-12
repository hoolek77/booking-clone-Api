require('dotenv').config()

const terminateServer = require('./helpers/terminateServer')
const app = require('./startup/app')

if (process.env.NODE_ENV === 'production') {
  require('./startup/prod')(app) // load production middleware
}

// listen to the port
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.info(`Listening on port ${port}...`)
})

const exitHandler = terminateServer(server)

process.on('uncaughtException', exitHandler(1, 'Uncaught Exception'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise Rejection'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))
