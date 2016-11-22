const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
  let messeges = req.flash('error')
  res.render('login', { messeges, hasMesseges: messeges.length > 0 })
})

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })
)

module.exports = router
