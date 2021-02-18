const Joi = require('joi')
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Types.ObjectId,
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
    price: Joi.number.min(0),
    description: Joi.string().min(0),
  })

  return schema.validate(room)
}

exports.validate = validateRoom
exports.Room = Room
