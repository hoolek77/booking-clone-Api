const Reservation = require('../models/reservation')
const { Address } = require('../models/address')
const {
  hotelExists,
  roomExists,
  numberOfGuestsInRoom,
  getHotelIdsForOwner,
  getHotelOwnerId,
} = require('./hotelsService')
const { Hotel } = require('../models/hotel')
const { addDaysToDate, formatDate } = require('../helpers/date')
const { isRoomAvailable } = require('./hotelsService')
const { ForbiddenError, BadRequestError } = require('../helpers/apiError')
const { isObjIdEqualToMongoId } = require('../helpers/isObjIdEqualToMongoId')
const { notifyUser } = require('./notifyUser')

const CANCELLATION_DATE = 3

const canReservationBeCancelled = (reservation) => {
  const date = addDaysToDate(
    new Date(reservation.startDate),
    -CANCELLATION_DATE
  )
  const currentDate = new Date()

  return !reservation.isPaid && currentDate.getTime() < date.getTime()
}

const mapHotelModel = (hotel, roomId) => {
  const room = hotel.rooms.id(roomId)

  return {
    name: hotel.name,
    address: {
      country: hotel.localization.country,
      city: hotel.localization.city,
      zipcode: hotel.localization.zipcode,
      street: hotel.localization.street,
      buildingNumber: hotel.localization.buildingNumber,
    },
    room: {
      roomNumber: room.roomNumber,
      price: room.price,
      description: room.description,
    },
  }
}

const getUserReservations = async (user) => {
  const reservations = await Reservation.find({ user: user._id })
    .select('-user')
    .populate({
      path: 'hotel',
      select: 'name localization rooms',
    })

  return reservations.map((reservation) => {
    return {
      _id: reservation._id,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      people: reservation.people,
      hotel: mapHotelModel(reservation.hotel, reservation.room),
    }
  })
}

const getHotelOwnerReservations = async (user) => {
  const hotelIds = await getHotelIdsForOwner(user._id)
  const reservations = await Reservation.find({ hotel: { $in: hotelIds } })
    .populate({
      path: 'user',
      select: 'email firstName lastName -_id',
    })
    .populate({
      path: 'hotel',
      select: 'name localization rooms',
    })

  return reservations.map((reservation) => {
    return {
      _id: reservation._id,
      isPaid: reservation.isPaid,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      people: reservation.people,
      hotel: mapHotelModel(reservation.hotel, reservation.room),
      user: {
        email: reservation.user.email,
        firstName: reservation.user.firstName,
        lastName: reservation.user.lastName,
      },
    }
  })
}

const getReservations = async (user) => {
  if (user.isStandardUser) {
    return await getUserReservations(user)
  } else if (user.isHotelOwner) {
    return await getHotelOwnerReservations(user)
  }
}

const saveReservation = async (user, data) => {
  if (user.isStandardUser) {
    if (!isObjIdEqualToMongoId(user._id, data.user)) {
      throw new ForbiddenError('You are not allowed to make a reservation.')
    }
  } else {
    throw new ForbiddenError('You are not allowed to make a reservation.')
  }

  data.startDate = formatDate(data.startDate, true)
  data.endDate = formatDate(data.endDate, true)

  const { room, people, startDate, endDate } = data
  const hotelId = data.hotel

  const hotel = await Hotel.findById(hotelId)

  if (!(await hotelExists(hotel))) {
    throw new BadRequestError('Hotel does not exist.')
  }

  if (!(await roomExists(hotel, room))) {
    throw new BadRequestError('Room does not exist.')
  }

  if (!(await isRoomAvailable(hotel, room, startDate, endDate))) {
    throw new BadRequestError('The room is not available.')
  }

  const guests = await numberOfGuestsInRoom(hotel, room)
  const numberOfPersons = +people.adults + +people.children

  if (numberOfPersons > guests) {
    throw new BadRequestError('Exceeded number of visitors.')
  }

  const reservation = new Reservation(data)
  await reservation.save()

  notifyUser(
    user,
    {
      emailSubject: 'Reservation booked',
      templateView: 'reservation.html',
      hotel: hotel.name,
    },
    {
      smsMsg: `You successfully booked your reservation at: ${hotel.name}`,
    }
  )

  return { reservationId: reservation.id }
}

const cancelReservation = async (user, reservationId) => {
  const reservation = await Reservation.findOne({ _id: reservationId })

  if (!reservation) {
    throw new BadRequestError('Reservation not found.')
  }

  if (user.isStandardUser) {
    if (!isObjIdEqualToMongoId(user._id, reservation.user)) {
      throw new ForbiddenError(
        'You are not allowed to cancel this reservation.'
      )
    }
  } else if (user.isHotelOwner) {
    const hotelOwnerId = await getHotelOwnerId(reservation.hotel)

    if (!hotelOwnerId) {
      throw new BadRequestError('An error occurred while checking hotel owner.')
    }

    if (!isObjIdEqualToMongoId(user._id, hotelOwnerId)) {
      throw new ForbiddenError(
        'You are not allowed to cancel this reservation.'
      )
    }
  } else {
    throw new ForbiddenError('You are not allowed to cancel this reservation.')
  }

  if (!canReservationBeCancelled(reservation)) {
    throw new BadRequestError('The reservation cannot be cancelled.')
  }

  const deletedReservation = await reservation.delete()

  const hotel = await Hotel.findById(reservation.hotel)

  notifyUser(
    user,
    {
      emailSubject: 'Cancelled reservation',
      templateView: 'reservationRemoved.html',
      hotel: hotel.name,
    },
    {
      smsMsg: 'Your reservation has been cancelled',
    }
  )

  return deletedReservation !== null
}

const updatePayment = async (id) => {
  const reservation = await Reservation.findByIdAndUpdate(
    id,
    {
      isPaid: true,
    },
    { new: true }
  )

  return reservation
}

module.exports = {
  getReservations,
  saveReservation,
  cancelReservation,
  updatePayment,
}
