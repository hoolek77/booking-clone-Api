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
const ApiError = require('../helpers/apiError')
const { isObjIdEqualToMongoId } = require('../helpers/isObjIdEqualToMongoId')
const { notifyUser } = require('./notifyUser')

const CANCELLATION_DATE = 3

const isRoomAvailable = async (hotelId, roomId, startDate, endDate) => {
  return !(await Reservation.exists({
    hotel: hotelId,
    room: roomId,
    $or: [
      // start after startDate and after before endDate --- |
      {
        startDate: { $lt: startDate, $lt: endDate },
        endDate: { $gt: startDate, $lt: endDate },
      },
      // between some reservation time
      {
        startDate: { $lte: startDate, $lte: endDate },
        endDate: { $gte: startDate, $gte: endDate },
      },
      // start before startDate and end before endDate | ---
      {
        startDate: { $gt: startDate, $lt: endDate },
        endDate: { $gt: startDate, $lt: endDate },
      },
    ],
  }))
}

const canReservationBeCancelled = (reservation) => {
  const date = addDaysToDate(
    new Date(reservation.startDate),
    -CANCELLATION_DATE
  )
  const currentDate = new Date()

  return !reservation.isPaid && currentDate.getTime() < date.getTime()
}

const getUserReservations = async (user) => {
  const reservations = await Reservation.find({ user: user._id })
    .select('-user')
    .populate({
      path: 'hotel',
      select: 'name localization rooms',
      populate: {
        path: 'localization',
        select: {
          _id: 0,
          country: 1,
          city: 1,
          zipcode: 1,
          street: 1,
          buildingNumber: 1,
        },
        model: Address,
      },
    })

  return reservations.map((reservation) => {
    const room = reservation.hotel.rooms.id(reservation.room)

    return {
      _id: reservation._id,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      people: reservation.people,
      hotel: {
        name: reservation.hotel.name,
        address: reservation.hotel.localization,
        room: {
          roomNumber: room.roomNumber,
          price: room.price,
          description: room.description,
        },
      },
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
      populate: {
        path: 'localization',
        select: {
          _id: 0,
          country: 1,
          city: 1,
          zipcode: 1,
          street: 1,
          buildingNumber: 1,
        },
        model: Address,
      },
    })

  return reservations.map((reservation) => {
    const room = reservation.hotel.rooms.id(reservation.room)

    return {
      _id: reservation._id,
      isPaid: reservation.isPaid,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      people: reservation.people,
      hotel: {
        name: reservation.hotel.name,
        address: reservation.hotel.localization,
        room: {
          roomNumber: room.roomNumber,
          price: room.price,
          description: room.description,
        },
      },
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
      throw new ApiError(403, 'You are not allowed to create a reservation.')
    }
  } else {
    throw new ApiError(403, 'You are not allowed to create a reservation.')
  }

  const defaultErrorMessage = 'Reservation failed.'

  data.startDate = formatDate(data.startDate, true)
  data.endDate = formatDate(data.endDate, true)

  const { hotel, room, people, startDate, endDate } = data

  if (!(await hotelExists(hotel))) {
    throw new ApiError(404, defaultErrorMessage)
  }

  if (!(await roomExists(hotel, room))) {
    throw new ApiError(404, defaultErrorMessage)
  }

  if (!(await isRoomAvailable(hotel, room, startDate, endDate))) {
    throw new ApiError(404, 'The room is not available.')
  }

  const guests = await numberOfGuestsInRoom(hotel, room)
  const numberOfPersons = +people.adults + +people.children

  if (numberOfPersons > guests) {
    throw new ApiError(404, 'Exceeded number of visitors.')
  }

  const reservation = new Reservation(data)
  await reservation.save()

  notifyUser(
    user.isSmsAllowed,
    user.email,
    'Reservation booked',
    'reservation',
    `${user.firstName} ${user.lastName}`,
    hotel.name,
    'BookingCloneApi',
    user.phoneNumber,
    `You successfully booked your reservation at: ${hotel.name}`
  )

  return true
}

const cancelReservation = async (user, reservationId) => {
  const reservation = await Reservation.findOne({ _id: reservationId })

  if (!reservation) {
    throw new ApiError(404, 'Reservation not found.')
  }

  if (user.isStandardUser) {
    if (!isObjIdEqualToMongoId(user._id, reservation.user)) {
      throw new ApiError(403, 'You are not allowed to cancel this reservation.')
    }
  } else if (user.isHotelOwner) {
    const hotelOwnerId = await getHotelOwnerId(reservation.hotel)

    if (!hotelOwnerId) {
      throw new ApiError(400, 'An error occurred while cancelling reservation.')
    }

    if (!isObjIdEqualToMongoId(user._id, hotelOwnerId)) {
      throw new ApiError(403, 'You are not allowed to cancel this reservation.')
    }
  } else {
    throw new ApiError(403, 'You are not allowed to cancel this reservation.')
  }

  if (!canReservationBeCancelled(reservation)) {
    throw new ApiError(400, 'The reservation cannot be cancelled.')
  }

  const deletedReservation = await reservation.delete()

  const hotel = await Hotel.findById(reservation.hotel)

  notifyUser(
    user.isSmsAllowed,
    user.email,
    'Cancelled reservation',
    'reservationRemoved',
    `${user.firstName} ${user.lastName}`,
    hotel.name,
    'BookingCloneApi',
    user.phoneNumber,
    'Your reservation has been cancelled'
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
  isRoomAvailable,
  cancelReservation,
  updatePayment,
}
