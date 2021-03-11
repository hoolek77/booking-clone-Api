const { sendSms } = require('./sms/index')
const { sendMail } = require('./email/index')
const logger = require('../helpers/logger')

function notifyUser(
  isSmsAllowed,
  userEmail,
  subjectEmail,
  viewEmail,
  userName,
  hotelName,
  from,
  number,
  textSms
) {
  try {
    sendMail(userEmail, subjectEmail, viewEmail, userName, hotelName)
    if (isSmsAllowed) {
      sendSms(from, number, textSms)
    }
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = {
  notifyUser,
}
