const mongoose = require('mongoose');

let threadSchrema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  messages: []
});

mongoose.model("Thread", threadSchrema);

module.exports = mongoose.model("Thread");