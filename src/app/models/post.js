const mongoose = require('mongoose')
const Schema = mongoose.Schema

let postSchema = new Schema({
  ownerUsername: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    require: true
  },
  town: {
    type: String,
    require: true
  },
  petType: {
    type: String,
    enum: ['cat', 'dog', 'other'],
    require: true
  },
  imgUrls: {
    type: [String]
  },
  isArchived: {
    type: Boolean,
    required: true
  }
})

let Post = mongoose.model('Post', postSchema)

module.exports = Post
