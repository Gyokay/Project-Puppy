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
      db.Message.updateAllToSeenByReceiverAndSender(
        req.user.username,
        req.body.receiver
      )

      res.send(messages)
    })
})

router.post('/get-new-message-count', (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({ error: 'not authenticated' })
    return
  }

  let senders = req.body['senders[]']
  let sendersArr = []

  let promises = []
  let countsBySenders = []

  if (!Array.isArray(senders)) {
    sendersArr.push(senders)
    senders = sendersArr
  }

  senders.forEach(sender => {
    promises.push(db.Message.getAllUnseenCountBySenderAndReceiver(sender, req.user.username)
      .then(count => {
        countsBySenders.push({ sender, count })
      }))
  })

  Promise.all(promises)
    .then(() => {
      res.json(countsBySenders)
    })
})

module.exports = router
