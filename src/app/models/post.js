const mongoose = require('mongoose');
const validators = require('mongoose-validators');
const constants = require('../common/constants');
const Schema = mongoose.Schema;

let postSchema = new Schema({
  ownerUsername: {
    type: String,
    required: true,
    validate: [validators.isLength(constants.minPostUsernameLenght, constants.maxPostUsernameLenght)]
  },
  title: {
    type: String,
    required: true,
    validate: [validators.isLength(constants.minPostTitleLenght, constants.maxPostTitleLenght)]
  },
  description: {
    type: String,
    validate: [validators.isLength(constants.minPostDescriptionLenght, constants.maxPostDescriptionLenght)]
  },
  creationDate: {
    type: Date,
    required: true
  },
  town: {
    type: String,
    required: true,
    validate: [validators.isLength(constants.minPostTownLenght, constants.maxPostTownLenght)]
  },
  petType: {
    type: String,
    enum: ['cat', 'dog', 'other'],
    required: true
  },
  imgUrls: {
    type: [String]
  },
  isArchived: {
    type: Boolean,
    required: true
  }
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;
