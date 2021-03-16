const mongoose = require('mongoose')
const { roomSchema } = require('./room')
const { clientRateSchema } = require('./rate')
const { addressSchema } = require('./address')

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    localization: addressSchema,
    phoneNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    clientsRates: {
      type: [clientRateSchema],
      default: [],
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    rooms: {
      type: [roomSchema],
      required: true,
    },
  }, 
  { timestamps: true }
)

hotelSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v

  return obj
}

const Hotel = mongoose.model('Hotel', hotelSchema)

exports.Hotel = Hotel
