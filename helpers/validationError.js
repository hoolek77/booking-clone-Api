const ApiError = require('../helpers/apiError')

function parseError(error) {
  return error.details.map((err) => err.message).join('\n')
}

function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false,
  }

  const { error, value } = schema.validate(req.body, options)

  if (error) {
    next(new ApiError(400, parseError(error)))
  } else {
    req.body = value
    next()
  }
}

module.exports = {
  validateRequest,
}
