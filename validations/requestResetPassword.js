const Joi = require('joi')
const { validateData } = require('./validateData')

module.exports = function validateResetPassword(data) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required().label('Email'),
  })

  return validateData(data, schema)
}
