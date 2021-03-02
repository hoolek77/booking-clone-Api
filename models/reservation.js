const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    room: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    people: {
      type: Object,
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        required: true,
        min: 0,
      },
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

reservationSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.createdAt
  delete obj.updatedAt
  delete obj.__v

  return obj
}

const Reservation = mongoose.model('Reservation', reservationSchema)

module.exports = Reservation
