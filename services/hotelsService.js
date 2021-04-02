const { Hotel } = require('../models/hotel')
const { NotFoundError } = require('../helpers/apiError')
const { formatDate } = require('../helpers/date')
const Reservation = require('../models/reservation')

const DEFAULT_PAGE_SIZE = 50

const filterRooms = (hotel, adults, children) => {
  return hotel.rooms.filter(
    (r) =>
      r.beds.single + r.beds.double * 2 >= parseInt(adults) + parseInt(children)
  )
}

const isHotelAvailable = async (
  hotelId,
  startDate,
  endDate,
  adults,
  children
) => {
  const hotel = await Hotel.findOne({ _id: hotelId })

  if (!hotel) {
    throw new NotFoundError('Hotel not found.')
  }

  const rooms = filterRooms(hotel, adults, children)

  let isAvailable = false
  for (let room of rooms) {
    isAvailable = await isRoomAvailable(
      hotelId,
      room._id,
      formatDate(startDate, true),
      endDate
    )
    if (isAvailable) break
  }

  return isAvailable
}

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

exports.isRoomAvailable = isRoomAvailable

exports.getHotels = async (req) => {
  const { city, adults, children, startDate, endDate } = req.query
  let { pageNumber, pageSize } = req.query

  const hotelsLength = city
    ? await Hotel.countDocuments({ 'localization.city': city })
    : await Hotel.countDocuments()

  pageNumber = pageNumber ? pageNumber : 1
  pageSize = pageSize ? pageSize : DEFAULT_PAGE_SIZE

  const hotels = await Hotel.find(city ? { 'localization.city': city } : null)
    .skip((+pageNumber - 1) * +pageSize)
    .limit(+pageSize)

  if (startDate && endDate) {
    const freeHotels = []

    for (let hotel of hotels) {
      const isAvailable = await isHotelAvailable(
        hotel._id,
        formatDate(startDate, true),
        formatDate(endDate, true),
        adults,
        children
      )
      if (isAvailable) {
        freeHotels.push(hotel)
      }
    }

    return {
      hotels: freeHotels,
      pages: Math.ceil(freeHotels.length / pageSize),
    }
  }

  return { hotels, pages: Math.ceil(hotelsLength / pageSize) }
}

exports.getHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    throw new NotFoundError('Hotel not found')
  }

  return hotel
}

exports.getLimitedHotels = async (limit) => {
  const hotels = await Hotel.find().limit(limit)

  return hotels
}

exports.hotelExists = async (hotelId) => {
  return await Hotel.exists({ _id: hotelId })
}

exports.roomExists = async (hotelId, roomId) => {
  return await Hotel.exists({ _id: hotelId, 'rooms._id': roomId })
}

exports.numberOfGuestsInRoom = async (hotelId, roomId) => {
  const hotel = await Hotel.findOne({ _id: hotelId, 'rooms._id': roomId })

  if (!hotel) {
    return 0
  }

  const room = hotel.rooms.id(roomId)

  return room.beds.single + 2 * room.beds.double
}

exports.getHotelIdsForOwner = async (hotelOwnerId) => {
  return await Hotel.find({ ownerId: hotelOwnerId }).distinct('_id')
}

exports.getHotelOwnerId = async (hotelId) => {
  const hotel = await Hotel.findOne({ _id: hotelId }).select('ownerId -_id')

  if (!hotel) {
    return null
  }

  return hotel.ownerId
}

exports.getAvailableHotelRooms = async (req) => {
  const { id: hotelId } = req.params
  const { adults, children, startDate, endDate } = req.query

  const hotel = await Hotel.findOne({ _id: hotelId })

  if (!hotel) {
    throw new NotFoundError('Hotel not found.')
  }

  const rooms = filterRooms(hotel, adults, children)

  const freeRooms = []

  for (let room of rooms) {
    if (
      await isRoomAvailable(
        hotelId,
        room._id,
        formatDate(startDate, true),
        formatDate(endDate, true)
      )
    ) {
      freeRooms.push(room)
    }
  }

  return freeRooms
}
