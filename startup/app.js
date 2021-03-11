const express = require('express')
require('express-async-errors')
const app = express()

require('./routes')(app) // load route
require('./db')() // connect to the DB
require('./config')() // config db

module.exports = app
