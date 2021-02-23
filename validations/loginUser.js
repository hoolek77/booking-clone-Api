const Joi = require('joi')
const { validateRequest } = require('../helpers/validationError')

module.exports = function validateLoginUser(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required().label('Email'),
    password: Joi.string().min(8).max(30).required().label('Password'),
  })

  validateRequest(req, next, schema)
}
