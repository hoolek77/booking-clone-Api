const Joi = require('joi')
const mongoose = require('mongoose')

const adressSchema = new mongoose.Schema({
  adressId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
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

const Address = mongoose.model('Address', adressSchema)

const validateAddress = (address) => {
  const schema = Joi.object({
    addresId: Joi.ObjectId().required(),
    country: Joi.string().min(0).required(),
    city: Joi.string().min(0).required(),
    zipcode: Joi.number.min(0).required(),
    street: Joi.string().min(0).required(),
  })

  return schema.validate(address)
}

exports.Address = Address
exports.validate = validateAddress
