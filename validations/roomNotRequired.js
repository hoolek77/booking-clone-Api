const Joi = require('joi')
const { validateData } = require('./validateData')

module.exports = function validateRoom(data) {
  const schema = Joi.object({
    roomNumber: Joi.string(),
    beds: {
      single: Joi.number().min(0),
      double: Joi.number().min(0),
    },
    price: Joi.number().min(10),
    description: Joi.string().allow(''),
  })

  return validateData(data, schema)
}
