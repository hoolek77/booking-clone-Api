require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {
  SUPPORTED_ROLES,
  USER_ROLE,
  HOTEL_OWNER_ROLE,
  ADMIN_ROLE,
} = require('./roles')

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
      enum: SUPPORTED_ROLES,
      default: USER_ROLE,
    },
  },
  { timestamps: true }
)

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('isAdmin').get(function () {
  return this.role === ADMIN_ROLE
})

userSchema.virtual('isHotelOwner').get(function () {
  return this.role === HOTEL_OWNER_ROLE
})

userSchema.virtual('isStandardUser').get(function () {
  return this.role === USER_ROLE
})

userSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error)
    }

    callback(null, isMatch)
  })
}

userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.createdAt
  delete obj.updatedAt
  delete obj.__v

  return obj
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, salt)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
