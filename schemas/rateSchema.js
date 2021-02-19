const Joi = require('joi')
const mongoose = require('mongoose')

const rateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    userId: Joi.ObjectId().required(),
    desc: Joi.string(),
    rateNumber: Joi.number.min(1).max(5),
  })
  return schema.validate(rate)
}

exports.validate = validateRate
exports.Rate = Rate
