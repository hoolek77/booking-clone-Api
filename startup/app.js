const express = require('express')
const app = express()

require('./routes')(app) // load route
require('./db')() // connect to the DB
require('./config')() // config db

module.exports = app
