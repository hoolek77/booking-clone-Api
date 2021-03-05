const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateData } = require('./validateData')

module.exports = function validateAddressData(data) {
  const schema = Joi.object({
    country: Joi.string().min(0).required(),
    city: Joi.string().required(),
    zipcode: Joi.string().min(0).required(),
    street: Joi.string().min(0).required(),
    buildingNumber: Joi.number().min(1).required(),
  })

  return validateData(data, schema)
}
