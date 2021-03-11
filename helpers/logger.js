const { createLogger, format, transports } = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const messageFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  format.printf(
    (info) =>
      `[${info.timestamp}] ${[info.level.toUpperCase()]}: ${info.message}`
  )
)

module.exports = createLogger({
  transports: [
    new transports.Console({ format: messageFormat }),
    new DailyRotateFile({
      filename: 'logs/api-%DATE%.log',
      format: messageFormat,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      prepend: true,
    }),
  ],
})
