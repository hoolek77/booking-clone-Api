const Joi = require('joi')
const { validateRequest } = require('../helpers/validationError')
const { USER_ROLE, HOTEL_OWNER_ROLE } = require('../models/roles')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))

module.exports = function validateCreateUser(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required(),
    password: Joi.string().min(8).max(30).required(),
    repeatPassword: Joi.valid(Joi.ref('password')),
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    phoneNumber: JoiPhoneNumer.string().max(20).phoneNumber(),
    tin: Joi.number(),
    role: Joi.string().valid(USER_ROLE, HOTEL_OWNER_ROLE),
  }).with('password', 'repeatPassword')

  validateRequest(req, next, schema)
}
