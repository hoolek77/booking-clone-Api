const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
    },
    beds: {
      type: Object,
      single: {
        type: Number,
        require: true,
      },
      double: {
        type: Number,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  }, 
  { timestamps: true }
)

roomSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v

  return obj
}

exports.roomSchema = roomSchema
