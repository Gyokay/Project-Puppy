const Message = require('../models/message')

function insert(sender, receiver) {
  return new Promise((resolve, reject) => {
    let newMessage = new Message({
      sender,
      receiver,
      sentOn: new Date(),
      isSeen: false
    })

    newMessage.save(newMessage, (err, message) => {
      if (err) {
        console.log(err)
      }

      resolve(message)
    })
  })
}

function getAllUniqueSenderNamesByReceaver(receiver) {
  return new Promise((resolve, reject) => {
    Message.find()
      .distinct('sender')
      .where('receiver').equals(receiver)
      .exec((err, senderUsernames) => {
        if (err) {
          console.log(err)
        }
        resolve(senderUsernames)
      })
  })
}

function getAllUniqueReceiverNamesBySender(sender) {
  return new Promise((resolve, reject) => {
    Message.find()
      .distinct('receiver')
      .where('sender').equals(sender)
      .exec((err, receiverUsername) => {
        if (err) {
          console.log(err)
        }
        resolve(receiverUsername)
      })
  })
}

function getAllBySenderAndReceiver(sender, receiver) {
  return new Promise((resolve, reject) => {
    Message.find()
      .or([
        { $and: [{ sender }, { receiver }] },
        { $and: [{ sender: receiver }, { receiver: sender }] }
      ])
      .exec((err, messages) => {
        if (err) {
          console.log(err)
        }
        resolve(messages)
      })
    // Message.find({ $or: [{ receiver }, { sender }, { receiver: sender }] })
    // Message.find({
    //   sender,
    //   receiver
    // }, (err, messages) => {
    //   if (err) {
    //     console.log(err)
    //   }
    //   resolve(messages)
    // })
  })
}

module.exports = {
  insert,
  getAllUniqueSenderNamesByReceaver,
  getAllUniqueReceiverNamesBySender,
  getAllBySenderAndReceiver
}
