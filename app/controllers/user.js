const express = require('express')
const router = express.Router()
const db = require('../data')

router.get('/:username', (req, res) => {
  db.Users.getUserByUsername(req.params.username)
    .then(user => {
      if (!user) {
        res.render('not-found')
        return
      }

      res.render('user-profile', { username: user.username })
    })
})

module.exports = router
