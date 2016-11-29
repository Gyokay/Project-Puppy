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
  }

  // db.Message.insert('posho', req.user.username)
  // db.Message.insert('posho', req.user.username)
  // db.Message.insert('gosho', req.user.username)
  // db.Message.insert('mitko', req.user.username)
  // db.Message.insert('patka', req.user.username)
  // db.Message.insert('posho', req.user.username)
  // db.Message.insert(req.user.username, 'salata')

  // db.Message.insert('hi', req.user.username, 'ssssssss')
  // db.Message.insert('whats up', 'ssssssss', req.user.username)
  // db.Message.insert('i am fine you', 'ssssssss', req.user.username)
  // db.Message.insert('hi', 'pesho', req.user.username)

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
    res.render('/login')
    return
  }

  let receiver = req.params.username
  req.session.receiver = receiver
  res.redirect('/chat')
})

module.exports = router
