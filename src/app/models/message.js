const mongoose = require('mongoose')
const Schema = mongoose.Schema

let messageSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  sentOn: {
    type: Date,
    required: true
  },
  isSeen: {
    type: Boolean,
    required: true
  }
})

let Message = mongoose.model('Comment', messageSchema)

module.exports = Message
