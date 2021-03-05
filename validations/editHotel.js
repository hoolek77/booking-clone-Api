const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateData } = require('./validateData')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))

module.exports = function validateAddHotelData(data) {
  const roomSchema = Joi.object({
    roomNumber: Joi.string(),
    beds: {
      single: Joi.number().min(0),
      double: Joi.number().min(0),
    },
    price: Joi.number().min(10),
    description: Joi.string(),
  })

  const rateSchema = Joi.object({
    userId: Joi.objectId(),
    desc: Joi.string(),
    rateNumber: Joi.number().min(1).max(5),
  })

  const hotelSchema = Joi.object({
    localization: Joi.object(),
    phoneNumber: JoiPhoneNumer.string().phoneNumber(),
    name: Joi.string().min(1),
    clientsRate: Joi.array().items(rateSchema),
    email: Joi.string().email(),
    description: Joi.string(),
    rooms: Joi.array().min(1).items(roomSchema),
  })

  return validateData(data, hotelSchema)
}
