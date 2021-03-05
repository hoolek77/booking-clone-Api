const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateData } = require('./validateData')

module.exports = function validateAddressData(data) {
  const schema = Joi.object({
    country: Joi.string().min(0),
    city: Joi.string(),
    zipcode: Joi.string().min(0),
    street: Joi.string().min(0),
    buildingNumber: Joi.number().min(1),
  })

  return validateData(data, schema)
}
