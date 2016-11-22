const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')

const db = require('../data')

router.get('/', (req, res) => {
  res.render('register', { success: req.session.success, errors: req.session.errors })
  req.session.destroy()
})

// damn big controller
router.post('/', (req, res) => {
  req.checkBody('username', 'Username must be in the rang 6 - 20 characters')
    .len(6, 20)

  req.checkBody('email', 'Invalid Email')
    .isEmail()

  req.checkBody('password', 'Password must be in the rang 6 - 20 charactersd')
    .len(6, 20)

  let errors = req.validationErrors()

  if (errors) {
    req.session.errors = errors
    req.session.success = false
    res.redirect('/register')
  } else {
    let validateUniqueUsername = db.Users.getUserByUsername(req.body.username)
    let validateUniqueEmail = db.Users.getUserByEmail(req.body.email)

    Promise.all([validateUniqueUsername, validateUniqueEmail])
      .then(users => {
        let validationErrors = []

        console.log(users)

        if (users[0]) {
          req.session.success = false
          validationErrors.push({ param: 'username', msg: 'This username is already taken ;(', value: users[0].username })
          req.session.errors = validationErrors
        }

        if (users[1]) {
          req.session.success = false
          validationErrors.push({ param: 'email', msg: 'This email is already used', value: users[1].email })
          req.session.errors = validationErrors
        }

        if (req.session.success === false) {
          res.redirect('/register')
        }

        if (!users[0] && !users[1]) {
          let passHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null)

          db.Users.insertUser(req.body.username, req.body.email, passHash)
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
