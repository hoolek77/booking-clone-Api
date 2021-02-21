const Joi = require('joi')
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
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
    hotelId: Joi.objectId().required(),
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
