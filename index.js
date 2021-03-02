require('dotenv').config()

const app = require('./startup/app')

if (process.env.NODE_ENV === 'production') {
  require('./startup/prod')(app) // load production middleware
}

// listen to the port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.info(`Listening on port ${port}...`)
})
