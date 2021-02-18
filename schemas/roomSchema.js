const Joi = require('joi')
const mongoose = require('mongoose')
import { Hotel } from './hotelSchema'

const roomSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  beds: {
    single: {
      type: Number,
      require: true,
    },
    double: {
      type: Number,
      required: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const Room = mongoose.model('Room', roomSchema)

const validateRoom = (room) => {
  const schema = Joi.object({
    roomId: Joi.ObjectId().required(),
    beds: Joi.object({
      single: Joi.number.min(0),
      double: Joi.number.min(0),
    }),
    price: Joi.number.min(10),
    description: Joi.string(),
  })

  return schema.validate(room)
}

exports.validate = validateRoom
exports.Room = Room
