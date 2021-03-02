const Nexmo = require('nexmo')
const config = require('config')

const smsApiKey = config.get('sms.key')
const smsApiSecret = config.get('sms.secret')

const nexmo = new Nexmo({
  apiKey: smsApiKey,
  apiSecret: smsApiSecret,
})

const sendSms = (from, number, text) => {
  nexmo.message.sendSms(from, number, text)
}

//number format - 48111222333

module.exports = {
  sendSms: sendSms,
}
