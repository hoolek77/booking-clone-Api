const ApiError = require('../helpers/apiError')
const User = require('../models/user')
const Reservation = require('../models/reservation')
const { Hotel } = require('../models/hotel')
const { HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const { notifyUser } = require('./notifyUser')

exports.getUsers = async (userRole, hotelOwnerRole) => {
  const users = await User.find({ role: { $in: [userRole, hotelOwnerRole] } })

  return users
}

exports.getHotelOwners = async () => {
  const owners = await User.find({ role: HOTEL_OWNER_ROLE })

  return owners
}

exports.acceptUserToOwner = async (id) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { role: HOTEL_OWNER_ROLE }
  )
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  return user
}

exports.deleteOwner = async (id) => {
  const user = await User.findOneAndDelete({
    _id: id,
    role: HOTEL_OWNER_ROLE,
  })

  if (!user) {
    throw new ApiError(404, 'Hotel owner with provided id not found')
  }
}

exports.deleteUser = async (id) => {
  const user = await User.findOneAndDelete({
    _id: id,
    role: USER_ROLE,
  })
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
}

exports.deleteUsers = async (users, isForceDelete) => {
  for (const id of users) {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    const reservations = await Reservation.find({ user: id })
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
          'Account Deleted',
          'userDeletedAndReservationsCanceled',
          user.firstName,
          null,
          'BookingCloneApi',
          user.phoneNumber,
          'Your account has been deleted by admin, your reservations has been cancelled'
        )
      })
      await Reservation.deleteMany({ user: id })
      await User.findByIdAndDelete(id)
      return
    }
    if (reservations.length > 0 && !isForceDelete) {
      throw new ApiError(400, 'Remove reservations first')
    }
    await User.findByIdAndDelete(id)
    notifyUser(
      user.isSmsAllowed,
      user.email,
      'Account Deleted',
      'remove',
      user.firstName,
      null,
      'BookingCloneApi',
      user.phoneNumber,
      'Your account has been deleted by admin'
    )
  }
}

exports.deleteHotel = async (hotelId, isForceDelete) => {
  const reservations = await Reservation.find({ hotel: hotelId })
  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found')
  }
  if (reservations.length > 0 && isForceDelete) {
    await Reservation.deleteMany({ hotel: hotelId })
    await Hotel.findByIdAndDelete(hotelId)
    reservations.forEach(async ({ user, hotel }) => {
      const { name } = await Hotel.findById(hotel)
      notifyUser(
        user.isSmsAllowed,
        user.email,
        'Cancelled reservation',
        'reservationRemoved',
        user.firstName,
        name,
        'BookingCloneApi',
        user.phoneNumber,
        'Your reservation has been cancelled'
      )
    })
  }
  if (reservations.length > 0 && !isForceDelete) {
    throw new ApiError(400, 'Remove reservation first')
  }
  await Hotel.findByIdAndDelete(hotelId)
}

exports.verifyOwner = async (id) => {
  const user = await User.findOneAndUpdate(
    { _id: id, role: HOTEL_OWNER_ROLE },
    { isVerified: true }
  )
  if (!user) {
    throw new ApiError(404, 'Hotel owner not found')
  }

  notifyUser(
    user.isSmsAllowed,
    user.email,
    'Veryfication successful',
    'owner',
    user.firstName,
    null,
    'BookingCloneApi',
    user.phoneNumber,
    'You are now veryfied as a Hotel Owner. Your hotels are now available'
  )
  return user
}
