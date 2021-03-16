const { sendSms } = require('./sms/index')
const { sendMail } = require('./email/index')
const logger = require('../helpers/logger')

function notifyUser(
  user,
  emailData = {
    emailSubject,
    templateView,
  },
  smsData = {
    smsMsg,
  }
) {
  const { isSmsAllowed, email, phoneNumber } = user

  try {
    const { emailSubject = '', templateView = '', ...restEmailData } = emailData

    sendMail(email, emailSubject, templateView, {
      ...restEmailData,
      username: user.fullName,
    })

    if (isSmsAllowed) {
      sendSms(smsData, phoneNumber)
    }
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = {
  notifyUser,
}
