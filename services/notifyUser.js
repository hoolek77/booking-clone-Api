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
  sendMail(userEmail, subjectEmail, viewEmail, userName, hotelName)
  if (isSmsAllowed) {
    sendSms(from, number, textSms)
  }
}

module.exports = {
  notifyUser,
}
