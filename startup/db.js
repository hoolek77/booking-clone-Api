const mongoose = require('mongoose')
const config = require('config')

const host = config.get('database.host')
const dbName = config.get('database.dbName')

const dbConnectionStringProd = config.get('database.dbConnectionStringProd')

module.exports = function () {
  mongoose
    .connect(dbConnectionStringProd || `mongodb://${host}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.info('Connected to MongoDB...'))
}
