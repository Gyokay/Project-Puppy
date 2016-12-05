const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
