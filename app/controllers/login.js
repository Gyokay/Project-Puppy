const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/home')
  }

  let messeges = req.flash('error')
  res.render('login', { success: req.session.success, messeges, hasMesseges: messeges.length > 0 })
  req.session.destroy()
})

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })
)

module.exports = router
