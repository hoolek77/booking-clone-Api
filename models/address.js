const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  buildingNumber: {
    type: Number,
    required: true,
  },
})

addressSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v

  return obj
}

exports.addressSchema = addressSchema
