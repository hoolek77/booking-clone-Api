const {
  addRoom,
  getHotels,
  addHotel,
  updateHotel,
  deleteHotel,
} = require('../services/ownerService')

exports.addRoom = async (req, res, next) => {
  try {
    const hotel = await addRoom(req)
    res.status(200).send(hotel)
  } catch (error) {
    next(error)
  }
}

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await getHotels(req.user._id)
    res.status(200).send(hotels)
  } catch (error) {
    next(error)
  }
}

exports.addHotel = async (req, res, next) => {
  try {
    req.body.ownerId = req.user._id
    const hotel = await addHotel(req.body)
    res.status(200).send(hotel)
  } catch (error) {
    next(error)
  }
}

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await updateHotel(req.params.id, req.body)
    res.status(200).send(hotel)
  } catch (error) {
    next(error)
  }
}

exports.deleteHotel = async (req, res, next) => {
  try {
    const { forceDelete } = req.query
    const isForceDelete = forceDelete === 'true'
    await deleteHotel(req.user, req.params.id, isForceDelete)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
