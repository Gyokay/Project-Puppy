const express = require('express')
const router = express.Router()
const db = require('../data')

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }

  let uniqueUsernames = new Set()

  if (req.session.receiver) {
    uniqueUsernames.add(req.session.receiver)
    req.session.receiver = null
    req.session.save()
  }

  db.Message.getAllUniqueSenderNamesByReceaver(req.user.username)
    .then(senderUsernames => {
      senderUsernames.forEach(name => {
        uniqueUsernames.add(name)
      })
    })
    .then(() => {
      db.Message.getAllUniqueReceiverNamesBySender(req.user.username)
        .then(receiverUsernames => {
          receiverUsernames.forEach(name => {
            uniqueUsernames.add(name)
          })

          uniqueUsernames = Array.from(uniqueUsernames)
          res.render('chat', { uniqueUsernames })
        })
    })
})

router.get('/:username', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }

  let receiver = req.params.username
  req.session.receiver = receiver
  res.redirect('/chat')
})

module.exports = router
