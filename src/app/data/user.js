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

function getUserByUsername (username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, users) => {
      if (err) {
        console.log(err)
      }
      resolve(users)
    })
  })
}

function getUserByEmail (email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, users) => {
      if (err) {
        console.log(err)
      }
      resolve(users)
    })
  })
}

module.exports = {
  insertUser,
  getUserByUsername,
  getUserByEmail
}
