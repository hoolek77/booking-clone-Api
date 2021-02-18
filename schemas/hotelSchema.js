const Joi = require('joi')
const mongoose = require('mongoose')
import { Room } from './roomSchema'

const hotelSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  localization: {
    type: String,
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
  clientsRate: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  starts: {
    type: Number,
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
    hotelId: Joi.ObjectId().required(),
    ownerId: Joi.ObjectId().required(),
    localization: Joi.string().min(0).required(),
    phoneNumber: Joi.number.required(),
    name: Joi.string().min(1).required(),
    clientsRate: Joi.number.min(0).max(5).required(),
    email: Joi.email().required(),
    starts: Joi.number.min(0).max(5).required(),
    description: Joi.string().min(0).required(),
    rooms: Joi.array().items(Room),
  })

  return schema.validate(hotel)
}

exports.validate = validateHotel
exports.Hotel = Hotel
