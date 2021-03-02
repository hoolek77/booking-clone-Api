const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const config = require('config')

const mailUser = config.get('mail.user')
const mailPass = config.get('mail.pass')

function sendMail(mail, subject, view, username, hotel) {
  const filePath = path.join(__dirname, `./views/${view}.html`)
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  const replacements = {
    username: username,
    hotel: hotel,
  }
  const htmlToSend = template(replacements)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  })
  const mailOptions = {
    from: '"Booking Clone API" <bookingcloneapi@gmail.com>',
    to: mail,
    subject: subject,
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
