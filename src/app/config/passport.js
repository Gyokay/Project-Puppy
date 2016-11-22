const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt-nodejs')

const db = require('../data')

passport.serializeUser(function (user, done) {
  done(null, user.username)
})

passport.deserializeUser(function (username, done) {
  db.Users.getSingleUserByUserName(username)
    .then(user => {
      done(null, user)
    })
})

passport.use(new LocalStrategy((username, password, done) => {
  db.Users.getSingleUserByUserName(username)
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorect username.' })
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: 'Incorect password.'})
      }

      return done(null, user)
    })
}))
