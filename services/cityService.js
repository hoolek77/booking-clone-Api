const { BadRequestError } = require('../helpers/apiError')
const { City } = require('../models/city')

exports.getCities = async () => {
  const cities = await City.find()
  return cities
}
