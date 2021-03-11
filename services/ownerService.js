const { BadRequestError, ForbiddenError } = require('../helpers/apiError')
const { Hotel } = require('../models/hotel')
const User = require('../models/user')

const Reservation = require('../models/reservation')
const { isObjIdEqualToMongoId } = require('../helpers/isObjIdEqualToMongoId')
const { notifyUser } = require('./notifyUser')

exports.addRoom = async (req) => {
  const { id: hotelId } = req.params.id
  let hotel = await Hotel.findOne({ _id: hotelId })
  if (!hotel) throw new BadRequestError('Hotel with provided ID was not found.')
  if (!isObjIdEqualToMongoId(req.user._id, hotel.ownerId))
    throw new ForbiddenError('Forbidden')

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
    { _id: hotelId },
    { $push: { rooms: { $each: rooms } } }
  )
  hotel = await Hotel.findOne({ _id: hotelId })

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
    throw new BadRequestError('Hotel not found.')
  }
  const hotel = await Hotel.findById(id)

  return hotel
}

exports.deleteHotel = async (owner, id, isForceDelete) => {
  const hotel = await Hotel.findById(id)

  if (!isObjIdEqualToMongoId(hotel.ownerId, owner._id)) {
    throw new ForbiddenError('Forbidden')
  }
  const reservations = await Reservation.find({ hotel: id })

  if (reservations.length > 0 && !isForceDelete) {
    throw new BadRequestError(
      'Remove reservations first or check `force delete` flag'
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
        `${user.firstName} ${user.lastName}`,
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
    `${owner.firstName} ${owner.lastName}`,
    hotel.name,
    'BookingCloneApi',
    owner.phoneNumber,
    `You removed your hotel: ${hotel.name}`
  )
}
