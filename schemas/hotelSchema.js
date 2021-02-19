const Joi = require('joi')
const mongoose = require('mongoose')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))
import { Room } from './roomSchema'
import { Rate } from './rateSchema'

const hotelSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  localization: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Addres',
    },
  ],
  phoneNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  clientsRates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rate' }],
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
})

const Hotel = mongoose.model('Hotel', hotelSchema)

const validateHotel = (hotel) => {
  const schema = Joi.object({
    ownerId: Joi.ObjectId().required(),
    localization: Joi.objectId().required(),
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
