const logger = require('./logger')

function terminateServer(server, options = { coredump: false, timeout: 500 }) {
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code)
  }

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      logger.error(err.message)
    }

    server.close(exit)
    setTimeout(exit, options.timeout).unref()
  }
}

module.exports = terminateServer
