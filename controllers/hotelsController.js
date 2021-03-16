const {
  getHotels,
  getHotel,
  getLimitedHotels,
  getHotelsByCity,
  getAvailableHotelRooms
} = require('../services/hotelsService')

exports.getAvailableHotelRooms = async (req, res, next) => {
  try {
    const freeRooms = await getAvailableHotelRooms(req)
    res.status(200).send(freeRooms)
  } catch (error) {
    next(error)
  }
}

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await getHotels(req)
    res.status(200).send(hotels)
  } catch (error) {
    next(error)
  }
}

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await getHotel(req.params.id)
    res.status(200).send(hotel)
  } catch (error) {
    next(error)
  }
}

exports.getLimitedHotels = async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit)
    const hotels = await getLimitedHotels(limit)
    res.status(200).send(hotels)
  } catch (error) {
    next(error)
  }
}

exports.getHotelsByCity = async (req, res, next) => {
  try {
    const hotels = await getHotelsByCity(req.params.city)
    res.status(200).send(hotels)
  } catch (error) {
    next(error)
  }
}
