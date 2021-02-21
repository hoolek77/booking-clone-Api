const Joi = require('joi')
const mongoose = require('mongoose')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))
const { Room } = require('./room')
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
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
})

const Hotel = mongoose.model('Hotel', hotelSchema)

const validateHotel = (hotel) => {
  const schema = Joi.object({
    ownerId: Joi.ObjectId().required(),
    localization: Joi.object().required(),
    phoneNumber: JoiPhoneNumer.string().phoneNumber(),
    name: Joi.string().min(1),
    clientsRate: Joi.array().items(Rate),
    email: Joi.email(),
    description: Joi.string().min(0),
    rooms: Joi.array().items(Room),
  })

  return schema.validate(hotel)
}

exports.validate = validateHotel
exports.Hotel = Hotel
