const ApiError = require('../helpers/apiError')
const { Hotel } = require('../models/hotel')
const User = require('../models/user')

const Reservation = require('../models/reservation')
const { calculateDays } = require('../helpers/calculateDays')
const { isObjIdEqualToMongoId } = require('../helpers/isObjIdEqualToMongoId')
const { notifyUser } = require('./notifyUser')

exports.addRoom = async (req) => {
  let hotel = await Hotel.findOne({ _id: req.params.hotelId })
  if (!hotel) throw new ApiError(404, 'Hotel with provided ID was not found.')
  if (!isObjIdEqualToMongoId(req.user._id, hotel.ownerId))
    throw new ApiError(403, 'Forbidden')

  const rooms = req.body.map((item) => ({
    roomNumber: item.roomNumber,
    beds: {
      single: item.beds.single,
      double: item.beds.double,
    },
    price: item.price,
    description: item.description,
  }))

  await Hotel.updateOne(
    { _id: req.params.hotelId },
    { $push: { rooms: { $each: rooms } } }
  )
  hotel = await Hotel.findOne({ _id: req.params.hotelId })

  return hotel
}

exports.getHotels = async (data) => {
  const hotels = await Hotel.find({ ownerId: data })

  return hotels
}

exports.addHotel = async (data) => {
  const hotel = new Hotel(data)
  await hotel.save()
  return hotel
}

exports.updateHotel = async (id, data) => {
  const hotelUpdate = await Hotel.findByIdAndUpdate(id, data)

  if (!hotelUpdate) {
    throw new ApiError(404, 'Hotel not found.')
  }
  const hotel = await Hotel.findById(id)

  return hotel
}

exports.deleteHotel = async (owner, id, isForceDelete) => {
  const hotel = await Hotel.findById(id)

  if (!isObjIdEqualToMongoId(hotel.ownerId, owner._id)) {
    throw new ApiError(403, 'Forbidden')
  }
  const reservations = await Reservation.find({ hotel: id })

  if (reservations.length > 0 && !isForceDelete) {
    throw new ApiError(
      400,
      'Remove reservations first or set flag force to true, please'
    )
  }

  if (reservations.length > 0 && isForceDelete) {
    const recivers = []
    reservations.forEach(({ user }) => {
      const userId = user.toString()
      recivers.push(userId)
    })

    const uniqueUsers = [...new Set(recivers)]
    uniqueUsers.forEach(async (uniqueUser) => {
      const user = await User.findById(uniqueUser)
      notifyUser(
        user.isSmsAllowed,
        user.email,
        'Reservations removed',
        'reservationRemoved',
        user.firstName,
        hotel.name,
        'BookingCloneApi',
        user.phoneNumber,
        'Your reservations has been cancelled'
      )
    })
    await Reservation.deleteMany({ hotel: id })
  }

  await Hotel.findByIdAndDelete(id)

  notifyUser(
    owner.isSmsAllowed,
    owner.email,
    'Hotel removed',
    'hotelRemoved',
    owner.firstName,
    hotel.name,
    'BookingCloneApi',
    owner.phoneNumber,
    `You removed your hotel: ${hotel.name}`
  )
}

exports.deleteReservation = async (id) => {
  const reservation = await Reservation.findByIdAndDelete(id)
  if (!reservation) {
    throw new ApiError(404, 'Reservation with given ID was not found')
  }

  const days = calculateDays(reservation.startDay)

  if (reservation.isPaid || days <= 3) {
    throw new ApiError(
      400,
      'Can not delete reservation; reservation is paid or or there is less than 3 days to start the stay in the hotel'
    )
  }

  return reservation
}
