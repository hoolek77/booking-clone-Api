const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))
const { roomSchema } = require('./room')
const { clientRateSchema } = require('./rate')
const { addressSchema } = require('./address')

const hotelSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  localization: addressSchema,
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  clientsRates: {
    type: [clientRateSchema],
    default: [],
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  rooms: {
    type: [roomSchema],
    required: true,
  },
})

const Hotel = mongoose.model('Hotel', hotelSchema)

//it will be moved in the next issue
//----------------------------------------
const schemaRate = Joi.object({
  userId: Joi.objectId().required(),
  desc: Joi.string(),
  rateNumber: Joi.number().min(1).max(5),
})

const schemaRoom = Joi.object({
  roomNumber: Joi.string().required(),
  beds: {
    single: Joi.number().min(0).required(),
    double: Joi.number().min(0).required(),
  },
  price: Joi.number().min(10).required(),
  description: Joi.string(),
})
//----------------------------------------

const validateHotel = (hotel) => {
  const schema = Joi.object({
    localization: Joi.object().required(),
    phoneNumber: JoiPhoneNumer.string().phoneNumber().required(),
    name: Joi.string().min(1).required(),
    clientsRate: Joi.array().items(schemaRate),
    email: Joi.string().email().required(),
    description: Joi.string(),
    rooms: Joi.array().min(1).items(schemaRoom).required(),
  })

  return schema.validate(hotel, { allowUnknown: false })
}

exports.validateHotel = validateHotel
exports.Hotel = Hotel
