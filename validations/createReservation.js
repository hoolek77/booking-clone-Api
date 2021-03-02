const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateData } = require('./validateData')

module.exports = function validateCreateReservation(data) {
  const schema = Joi.object({
    user: Joi.objectId().required().label('User Id'),
    hotel: Joi.objectId().required().label('Hotel Id'),
    room: Joi.objectId().required().label('Room Id'),
    startDate: Joi.date().iso().required().label('Reservation start date'),
    endDate: Joi.date()
      .iso()
      .min(Joi.ref('startDate'))
      .required()
      .label('Reservation end date'),
    people: Joi.object({
      adults: Joi.number().min(1).required().label('Number of adults'),
      children: Joi.number().min(0).required().label('Number of children'),
    })
      .required()
      .label('Number of guests'),
  })

  return validateData(data, schema)
}
