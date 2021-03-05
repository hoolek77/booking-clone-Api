const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateData } = require('./validateData')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))

module.exports = function validateAddHotelData(data) {
  const roomSchema = Joi.object({
    roomNumber: Joi.string().required(),
    beds: {
      single: Joi.number().min(0).required(),
      double: Joi.number().min(0).required(),
    },
    price: Joi.number().min(10).required(),
    description: Joi.string(),
  })

  const rateSchema = Joi.object({
    userId: Joi.objectId().required(),
    desc: Joi.string(),
    rateNumber: Joi.number().min(1).max(5),
  })

  const hotelSchema = Joi.object({
    localization: Joi.object().required(),
    phoneNumber: JoiPhoneNumer.string().phoneNumber().required(),
    name: Joi.string().min(1).required(),
    clientsRate: Joi.array().items(rateSchema),
    email: Joi.string().email().required(),
    description: Joi.string(),
    rooms: Joi.array().min(1).items(roomSchema).required(),
  })

  return validateData(data, hotelSchema)
}
