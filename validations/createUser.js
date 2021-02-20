const Joi = require('joi')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))

module.exports = function validateCreateUser(userObj) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required(),
    password: Joi.string().min(8).max(30).required(),
    repeatPassword: Joi.ref('password'),
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    phoneNumber: JoiPhoneNumer.string().max(20).phoneNumber(),
    tin: Joi.number(),
    isVerified: Joi.boolean(),
    role: Joi.string().valid('admin', 'user', 'hotelOwner'),
  })

  return schema.validate(userObj)
}
