const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const config = require('config')

const mailUser = config.get('mail.user')
const mailPass = config.get('mail.pass')

function createTemplate(templateView) {
  const filePath = path.join(__dirname, `./views/${templateView}`)
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  return template
}
function sendMail(
  recipientEmail,
  emailSubject,
  templateView,
  templateData = {
    username: '',
  }
) {
  const template = createTemplate(templateView)
  const htmlToSend = template(templateData)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  })

  const mailOptions = {
    from: '"Booking Clone API" <bookingcloneapi@gmail.com>',
    to: recipientEmail,
    subject: emailSubject,
    html: htmlToSend,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error
    } else {
      return 'Email sent: ' + info.response
    }
  })
}

module.exports = {
  sendMail: sendMail,
}
