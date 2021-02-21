const mongoose = require('mongoose')

const exampleSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
})

const Example = mongoose.model('Example', exampleSchema)

module.exports = Example
