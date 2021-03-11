const { sendSms } = require('./sms/index')
const { sendMail } = require('./email/index')

function notifyUser(
  user,
  emailData = {
    emailSubject,
    templateView,
  },
  smsData = {
    from = "BookingCloneApi",
    smsMsg
  }
) {
  const { isSmsAllowed, email, phoneNumber } = user
  try {
    sendMail(emailData, email, user.fullName)
    if (isSmsAllowed) {
      sendSms(smsData, phoneNumber)
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  notifyUser,
}
