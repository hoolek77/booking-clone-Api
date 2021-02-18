const Joi = require('joi')
const mongoose = require('mongoose')
import { Hotel } from './hotelSchema'

const rateSchema = new mongoose.Schema({
  rateId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
  },
  desc: {
    type: String,
    required: true,
  },
  rateNumber: {
    type: Number,
    required: true,
  },
})

const Rate = mongoose.model('Rate', rateSchema)

const validateRate = (rate) => {
  const schema = Joi.object({
    rateId: Joi.ObjectId().required(),
    personId: Joi.ObjectId().required(),
    desc: Joi.string(),
    rateNumber: Joi.number.min(0).max(5),
  })
  return schema.validate(rate)
}

exports.validate = validateRate
exports.Rate = Rate
