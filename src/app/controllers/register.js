const express = require('express')
const router = express.Router()
const db = require('../data')

router.get('/', (req, res) => {
  res.render('register', { success: req.session.success, errors: req.session.errors })
  req.session.destroy()
})

router.post('/', (req, res) => {
  req.checkBody('username', 'Invalid Username')
    .notEmpty()
    .len(6, 20)

  req.checkBody('email', 'Invalid Email')
    .notEmpty()
    .isEmail()

  req.checkBody('password', 'Invalid Password')
    .notEmpty()
    .len(6, 20)

  let errors = req.validationErrors()

  if (errors) {
    req.session.errors = errors
    req.session.success = false
    res.redirect('/register')
  } else {
    let validateUniqueUsername = db.Users.getUsersByUsername(req.body.username)
    let validateUniqueEmail = db.Users.getUsersByEmail(req.body.email)

    Promise.all([validateUniqueUsername, validateUniqueEmail])
      .then(arr => {
        let validationErrors = []

        if (arr[0].length !== 0) {
          req.session.success = false
          validationErrors.push({ param: 'username', msg: 'This username is already taken ;(', value: arr[0][0].username })
          req.session.errors = validationErrors
        }

        if (arr[1].length !== 0) {
          req.session.success = false
          validationErrors.push({param: 'email', msg: 'This email is already used', value: arr[1][0].email})
          req.session.errors = validationErrors
        }

        if (req.session.success === false) {
          res.redirect('/register')
        }

        if (arr[0].length === 0 && arr[1].length === 0) {
          db.Users.insertUser(req.body.username, req.body.email, req.body.password)
            .then(user => {
              req.session.success = true
              res.redirect('/register')
            })
            .catch(err => {
              console.log(err)
              // TO DO
              // in case of DB fail
              // sorry something went wrong message
            })
        }
      })
  }
})

module.exports = router
