const HttpStatusCode = require('../helpers/HttpStatusCode')

const sendError = (res, statusCode, errorMessage) => {
  res.status(statusCode).json({
    message: errorMessage,
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR

  if (err.isOperational) {
    sendError(res, err.statusCode, err.message)
  } else {
    console.error(err)

    if (err.name === 'CastError') {
      sendError(
        res,
        HttpStatusCode.BAD_REQUEST,
        `Invalid argument ${err.value}`
      )

      return
    }

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors)
        .map((el) => el.message)
        .join('.\n')

      sendError(res, HttpStatusCode.BAD_REQUEST, errors)

      return
    }

    sendError(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'Something went wrong!'
    )
  }
}
