const ApiError = require('../helpers/apiError')
const { Hotel } = require('../models/hotel')

exports.getHotels = async () => {
  const hotels = await Hotel.find()

  return hotels
}

exports.getHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    throw new ApiError(404, 'Hotel not found')
  }

  return hotel
}

exports.getLimitedHotels = async (limit) => {
  const hotels = await Hotel.find().limit(limit)

  return hotels
}

exports.getHotelsByCity = async (city) => {
  const hotels = await Hotel.find({ localization: { city: city } })

  return hotels
}
