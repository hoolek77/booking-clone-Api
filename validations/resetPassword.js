const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateData } = require('./validateData')

module.exports = function validateResetPassword(data) {
  const schema = Joi.object({
    userId: Joi.objectId().required().label('User Id'),
    token: Joi.string().required().label('Token'),
    password: Joi.string().min(8).max(30).required().label('Password'),
  })

  return validateData(data, schema)
}
