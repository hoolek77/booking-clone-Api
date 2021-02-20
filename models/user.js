require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const salt = +process.env.BCRYPT_SALT || 10

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      maxlength: 255,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 30,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    phoneNumber: {
      type: String,
      maxlength: 20,
    },
    tin: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'hotelOwner'],
      default: 'user',
    },
  },
  { timestamps: true }
)

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error)
    }

    callback(null, isMatch)
  })
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, salt)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
