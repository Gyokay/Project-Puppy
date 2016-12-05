module.exports = function (options) {
  options = options || {}

  if (!options.User) {
    options.User = require('../models/user')
  }

  return {
    insertUser (username, email, password) {
      return new Promise((resolve, reject) => {
        let newUser = new options.User({
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
    },
    getUserByUsername (username) {
      return new Promise((resolve, reject) => {
        options.User.findOne({ username }, (err, user) => {
          if (err) {
            console.log(err)
          }
          resolve(user)
        })
      })
    },
    getUsernamesBySubstring (substring) {
      return new Promise((resolve, reject) => {
        options.User.find({ username: new RegExp(substring, 'i') })
          .select('username')
          .exec((err, usernames) => {
            if (err) {
              console.log(err)
            }
            resolve(usernames)
          })
      })
    },
    getUserByEmail (email) {
      return new Promise((resolve, reject) => {
        options.User.findOne({ email }, (err, users) => {
          if (err) {
            console.log(err)
          }
          resolve(users)
        })
      })
    }

  }
}
