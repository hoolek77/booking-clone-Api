const Joi = require('joi')
const { validateData } = require('./validateData')

module.exports = function validateRoom(data) {
  const schema = Joi.object({
    roomNumber: Joi.string().required(),
    beds: {
      single: Joi.number().min(0).required(),
      double: Joi.number().min(0).required(),
    },
    price: Joi.number().min(10).required(),
    description: Joi.string().allow(''),
  })

  return validateData(data, schema)
}
