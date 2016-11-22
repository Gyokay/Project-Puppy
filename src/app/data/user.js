const User = require('../models/user')

function insertUser (username, email, password) {
  return new Promise((resolve, reject) => {
    let newUser = new User({
      username,
      email,
      password
    })
    newUser.save((err, user) => {
      if (err) {
        console.log(err)
      }
      resolve(user)
    })
  })
}

function getUserById (id) {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (err) {
        console.log(err)
      }
      resolve(user)
    })
  })
}

function getSingleUserByUserName (username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        console.log(err)
      }
      resolve(user)
    })
  })
}

function getUsersByUsername (username) {
  return new Promise((resolve, reject) => {
    // returns an array of Users
    User.find({ username }, (err, users) => {
      if (err) {
        console.log(err)
      }
      resolve(users)
    })
  })
}

function getUsersByEmail (email) {
  return new Promise((resolve, reject) => {
    User.find({ email }, (err, users) => {
      if (err) {
        console.log(err)
      }
      resolve(users)
    })
  })
}

module.exports = {
  insertUser,
  getUsersByUsername,
  getUsersByEmail,
  getSingleUserByUserName,
  getUserById
}
