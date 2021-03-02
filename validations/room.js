const Joi = require('joi')

const validateRoom = (room) => {
  const schema = Joi.object({
    name: Joi.string(),
    beds: {
      single: Joi.number().min(0),
      double: Joi.number().min(0),
    },
    price: Joi.number().min(10),
    description: Joi.string(),
  })

  return schema.validate(room)
}

exports.validateRoom = validateRoom
