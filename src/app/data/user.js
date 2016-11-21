const User = require('../models/user')

function insertUser (username) {
  return new Promise((resolve, reject) => {
    let newUser = new User({ username })
    newUser.save((err, user) => {
      if (err) {
        console.log(err)
      }
      console.log(user)
      resolve(user)
    })
  })
}

module.exports = {
  insertUser
}
