const mongoose = require('mongoose')

const rateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rateNumber: {
    type: Number,
    required: true,
  },
})

rateSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v

  return obj
}

const Rate = mongoose.model('Rate', rateSchema)

exports.Rate = Rate
exports.clientRateSchema = rateSchema
