const Joi = require('joi')
const { validateData } = require('./validateData')
const { USER_ROLE, HOTEL_OWNER_ROLE } = require('../models/roles')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))

module.exports = function validateCreateUser(data) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required().label('Email'),
    password: Joi.string().min(8).max(30).required().label('Password'),
    repeatPassword: Joi.valid(Joi.ref('password')).label(
      'Confirmation password'
    ),
    firstName: Joi.string().min(3).max(50).required().label('First name'),
    lastName: Joi.string().min(3).max(50).required().label('Last name'),
    phoneNumber: JoiPhoneNumer.string()
      .max(20)
      .phoneNumber()
      .label('Phone number'),
    tin: Joi.number().label('Tax identification number'),
    role: Joi.string().valid(USER_ROLE, HOTEL_OWNER_ROLE).label('User role'),
  }).with('password', 'repeatPassword')

  return validateData(data, schema)
}
