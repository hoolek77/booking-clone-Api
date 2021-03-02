const ApiError = require('../helpers/apiError')
const { Reservation, validate } = require('../models/reservation')

exports.getReservations = async () => {
  const reservations = await Reservation.find()

  return reservations
}

exports.addReservation = async (data) => {
  JoiValidate(data)
  const reservation = new Reservation(data)

  await reservation.save()

  return reservation
}

exports.updatePayment = async (id) => {
  const reservation = await Reservation.findByIdAndUpdate(
    id,
    {
      isPaid: true,
    },
    { new: true }
  )

  return reservation
}
