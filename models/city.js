const mongoose = require('mongoose')

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
  },
  { timestamps: true }
)

citySchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v

  return obj
}

const City = mongoose.model('City', citySchema)

exports.City = City
