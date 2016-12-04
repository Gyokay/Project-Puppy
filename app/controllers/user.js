const express = require('express')
const router = express.Router()
const db = require('../data')

router.get('/:username', (req, res) => {
  db.Post.getByUsername(req.params.username)
    .then(posts => {
      db.Users.getUserByUsername(req.params.username)
        .then(user => {
          if (!user) {
            res.render('not-found')
            return
          }

          let isOwner = false

          if (req.isAuthenticated()) {
            if (req.user.username === req.params.username) {
              isOwner = true
            }
          }

          res.render('user-profile', {
            username: user.username,
            email: user.email,
            posts,
            isOwner
          })
        })
    })
})

module.exports = router
