const Joi = require('joi')
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  beds: {
    type: Object,
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
    hotelId: Joi.objectId().required(),
    beds: {
      single: Joi.number.min(0),
      double: Joi.number.min(0),
    },
    price: Joi.number.min(10),
    description: Joi.string(),
  })

  return schema.validate(room)
}

exports.validate = validateRoom
exports.Room = Room
exports.roomSchema = roomSchema
