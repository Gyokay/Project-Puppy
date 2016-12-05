const mongoose = require('mongoose')
const regex = require('mongoose-regex')

let threadSchrema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    default: Date.now()
  },
  username: {
    type: String,
    required: true
  },
  messages: []
})

threadSchrema.plugin(regex)
threadSchrema.index({title: 'text'})
mongoose.model('Thread', threadSchrema)

module.exports = mongoose.model('Thread')
