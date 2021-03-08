const ApiError = require('../helpers/apiError')
const User = require('../models/user')
const Reservation = require('../models/reservation')
const { Hotel } = require('../models/hotel')
const { HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')

exports.getUsers = async (userRole, hotelOwnerRole) => {
  const users = await User.find({ role: { $in: [userRole, hotelOwnerRole] } })

  return users
}

exports.getHotelOwners = async () => {
  const owners = await User.find({ role: HOTEL_OWNER_ROLE })

  return owners
}

exports.acceptUserToOwner = async (id) => {
  const user = await User.updateOne({ _id: id }, { role: HOTEL_OWNER_ROLE })

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
    const reservation = await Reservation.find({ user: id })
    if (reservation.length > 0 && isForceDelete) {
      await Reservation.deleteMany({ user: id })
    }
    if (reservation.length > 0 && !isForceDelete) {
      throw new ApiError(400, 'Remove reservations first')
    }
    await User.findByIdAndDelete(id)
  }
}

exports.deleteHotel = async (hotelId, isForceDelete) => {
  const reservation = await Reservation.find({ hotel: hotelId })
  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found')
  }
  if (reservation.length > 0 && isForceDelete) {
    await Reservation.deleteMany({ hotel: hotelId })
    await Hotel.findByIdAndDelete(hotelId)
    //sms
  }
  if (reservation.length > 0 && !isForceDelete) {
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
}
