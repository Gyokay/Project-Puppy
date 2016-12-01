const express = require('express')
const router = express.Router()

const db = require('../../data')

router.post('/usernames-by-substring', (req, res) => {
  let substring = req.body.substring

  db.Users.getUsernamesBySubstring(substring)
    .then(usernames => {
      res.send(usernames)
    })
})

module.exports = router
