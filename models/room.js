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
    default: '',
  },
})

const validateRoom = (room) => {
  const schema = Joi.object({
    roomNumber: Joi.string().required(),
    beds: {
      single: Joi.number().min(0).required(),
      double: Joi.number().min(0).required(),
    },
    price: Joi.number().min(10).required(),
    description: Joi.string(),
  })

  return schema.validate(room)
}

exports.validateRoom = validateRoom
exports.roomSchema = roomSchema
