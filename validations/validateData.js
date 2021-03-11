const { BadRequestError } = require('../helpers/apiError')

function parseError(error) {
  return error.details.map((err) => err.message).join('\n')
}

function validateData(data, schema) {
  const options = {
    abortEarly: false,
  }

  const { error, value } = schema.validate(data, options)

  if (error) {
    throw new BadRequestError(parseError(error))
  }

  return value
}

module.exports = {
  validateData,
}
