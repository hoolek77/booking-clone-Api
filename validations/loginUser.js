const Joi = require('joi')

module.exports = function loginUser(userObj) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required(),
    password: Joi.string().min(8).max(30).required(),
  })

  return schema.validate(userObj)
}
