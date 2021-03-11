const { sendSms } = require('./sms/index')
const { sendMail } = require('./email/index')

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
    console.error(error)
  }
}

module.exports = {
  notifyUser,
}
