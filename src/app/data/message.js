const Message = require('../models/message')

function insert(message, sender, receiver) {
  return new Promise((resolve, reject) => {
    let newMessage = new Message({
      message,
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

function getAllBySenderAndReceiver(sender, receiver, count) {
  return new Promise((resolve, reject) => {
    Message.aggregate([
      {
        $match:
        {
          $or: [
            { $and: [{ sender }, { receiver }] },
            { $and: [{ sender: receiver }, { receiver: sender }] }
          ]
        }
      },
      { $sort: { sentOn: -1 } },
      { $limit: count },
      { $sort: { sentOn: 1 } }
    ])
      .exec((err, messags) => {
        if (err) {
          console.log(err)
        }
        resolve(messags)
      })
    // Message.find()
    //   .or([
    //     { $and: [{ sender }, { receiver }] },
    //     { $and: [{ sender: receiver }, { receiver: sender }] }
    //   ])
    //   .sort({ sentOn: 'desc' })
    //   .limit(count)
    //   // .sort({sentOn: 'asc'})
    //   .exec((err, messages) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //     resolve(messages)
    //   })
  })
}

module.exports = {
  insert,
  getAllUniqueSenderNamesByReceaver,
  getAllUniqueReceiverNamesBySender,
  getAllBySenderAndReceiver
}
