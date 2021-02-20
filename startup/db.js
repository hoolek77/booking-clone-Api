const mongoose = require('mongoose')
const config = require('config')

const host = config.get('database.host')
const dbName = config.get('database.dbName')

module.exports = function () {
  mongoose
    .connect(`mongodb://${host}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.info('Connected to MongoDB...'))
}
