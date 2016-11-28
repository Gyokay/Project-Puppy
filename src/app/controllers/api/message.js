const express = require('express')
const router = express.Router()

const db = require('../../data')

const numberOfMessagesPerRequest = 20

router.post('/getConversation', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ err: 'not authenticated' })
    return
  }

  db.Message.getAllBySenderAndReceiver(
    req.user.username,
    req.body.receiver,
    numberOfMessagesPerRequest
  )
    .then(messages => {
      console.log(messages)
      res.send(messages)
    })
})

module.exports = router
