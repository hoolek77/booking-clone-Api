const { BadRequestError } = require('../helpers/apiError')
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
    throw new BadRequestError('User not found')
  }

  return user
}

exports.deleteOwner = async (id) => {
  const hotel = await Hotel.find({ ownerId: id })
  if (hotel) throw new BadRequestError('Remove hotel(s) first')
  const user = await User.findOneAndDelete({
    _id: id,
    role: HOTEL_OWNER_ROLE,
  })
  if (!user) {
    throw new BadRequestError('Hotel owner with provided id not found')
  }
}

exports.deleteUsers = async (users, isForceDelete) => {
  for (const id of users) {
    const user = await User.findById(id)
    if (!user) {
      throw new BadRequestError('User not found')
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
          user,
          {
            emailSubject: 'Account Deleted',
            templateView: 'userDeletedAndReservationsCanceled.html',
          },
          {
            smsMsg:
              'Your account has been deleted by admin, your reservations has been cancelled',
          }
        )
      })
      await Reservation.deleteMany({ user: id })
      await User.findByIdAndDelete(id)
      return
    }
    if (reservations.length > 0 && !isForceDelete) {
      throw new BadRequestError('Remove reservations first')
    }
    await User.findByIdAndDelete(id)
    notifyUser(
      user,
      {
        emailSubject: 'Account Deleted',
        templateView: 'remove.html',
      },
      {
        smsMsg: 'Your account has been deleted by admin',
      }
    )
  }
}

exports.deleteHotel = async (hotelId, isForceDelete) => {
  const reservations = await Reservation.find({ hotel: hotelId })
  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    throw new BadRequestError('Hotel not found')
  }
  if (reservations.length > 0 && isForceDelete) {
    await Reservation.deleteMany({ hotel: hotelId })
    await Hotel.findByIdAndDelete(hotelId)
    reservations.forEach(async ({ user, hotel }) => {
      const { name } = await Hotel.findById(hotel)
      notifyUser(
        user,
        {
          emailSubject: 'Cancelled reservation',
          templateView: 'reservationRemoved.html',
          hotel: name,
        },
        {
          smsMsg: 'Your reservation has been cancelled',
        }
      )
    })
  }
  if (reservations.length > 0 && !isForceDelete) {
    throw new BadRequestError('Remove reservation first')
  }
  await Hotel.findByIdAndDelete(hotelId)
}

exports.verifyOwner = async (id) => {
  const user = await User.findOneAndUpdate(
    { _id: id, role: HOTEL_OWNER_ROLE },
    { isVerified: true }
  )
  if (!user) {
    throw new BadRequestError('Hotel owner not found')
  }

  notifyUser(
    user,
    {
      emailSubject: 'Veryfication successful',
      templateView: 'owner.html',
    },
    {
      smsMsg:
        'You are now veryfied as a Hotel Owner. Your hotels are now available',
    }
  )
  return user
}
