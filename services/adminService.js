const ApiError = require('../helpers/apiError')
const User = require('../models/user')

exports.getUsers = async () => {
  const users = await User.find()

  return users
}

exports.getHotelOwners = async (role) => {
  const owners = await User.find({ role: role })

  return owners
}

exports.acceptOwnersEmail = async (email, role) => {
  const user = await User.updateOne({ email: email }, { role: role })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  return user
}

exports.deleteOwner = async (email, role) => {
  const user = await User.findOneAndDelete({
    email: email,
    role: role,
  })

  if (!user) {
    throw new ApiError(404, 'Wrong email or user is not a hotel owner')
  }

  return user
}

exports.deleteUser = async (email, role) => {
  const user = await User.findOneAndDelete({
    email: email,
    role: role,
  })
  if (!user) {
    throw new ApiError(400, 'Wrong email')
  }
}
