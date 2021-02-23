const Joi = require('joi')
const { object } = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))
const { roomSchema } = require('./room')
const { clientRateSchema } = require('./rate')

const hotelSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  localization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  clientsRates: [clientRateSchema],
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rooms: [roomSchema],
})

const Hotel = mongoose.model('Hotel', hotelSchema)

const validateHotel = (hotel) => {
  const schema = Joi.object({
    ownerId: Joi.objectId(),
    localization: Joi.objectId(),
    phoneNumber: JoiPhoneNumer.string().phoneNumber(),
    name: Joi.string().min(1),
    clientsRate: Joi.array(),
    email: Joi.string().email(),
    description: Joi.string().min(0),
    rooms: Joi.array(),
  })

  return schema.validate(hotel, { allowUnknown: true })
}

exports.validate = validateHotel
exports.Hotel = Hotel
