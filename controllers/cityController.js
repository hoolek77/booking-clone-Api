const { getCities } = require('../services/cityService')

exports.getCities = async (req, res, next) => {
  try {
    const cities = await getCities()
    res.status(200).send(cities)
  } catch (error) {
    next(error)
  }
}
