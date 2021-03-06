module.exports = options => {
  options = options || {}

  if (!options.Message) {
    options.Message = require('../../app/models/message')
  }

  return {
    insert (message, sender, receiver) {
      return new Promise((resolve, reject) => {
        let newMessage = new options.Message({
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
    },

    updateToSeenById (_id) {
      return new Promise((resolve, reject) => {
        options.Message.update({ _id }, { $set: { isSeen: true } }, (err, message) => {
          if (err) {
            console.log(err)
          }
          resolve(message)
        })
      })
    },

    getUnseenMessagesCountByReceiver (receiver) {
      return new Promise((resolve, reject) => {
        options.Message.count()
          .where({ isSeen: false, receiver })
          .exec((err, count) => {
            if (err) {
              console.log(err)
            }
            resolve(count)
          })
      })
    },

    getAllUniqueSenderNamesByReceaver (receiver) {
      return new Promise((resolve, reject) => {
        options.Message.find()
          .distinct('sender')
          .where('receiver').equals(receiver)
          .exec((err, senderUsernames) => {
            if (err) {
              console.log(err)
            }
            resolve(senderUsernames)
          })
      })
    },

    getAllUniqueReceiverNamesBySender (sender) {
      return new Promise((resolve, reject) => {
        options.Message.find()
          .distinct('receiver')
          .where('sender').equals(sender)
          .exec((err, receiverUsername) => {
            if (err) {
              console.log(err)
            }
            resolve(receiverUsername)
          })
      })
    },

    updateAllToSeenByReceiverAndSender (receiver, sender) {
      return new Promise((resolve, reject) => {
        options.Message
          .update(
          { isSeen: false },
          { $set: { isSeen: true } },
          { multi: true }
          )
          .where({ receiver, sender })
          .exec((err, messages) => {
            if (err) {
              console.log(err)
            }
            resolve(messages)
          })
      })
    },

    getAllBySenderAndReceiver (sender, receiver, count) {
      return new Promise((resolve, reject) => {
        options.Message.aggregate([
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
      })
    },

    getAllUnseenCountBySenderAndReceiver (sender, receiver) {
      return new Promise((resolve, reject) => {
        options.Message.count()
          .where({ isSeen: false, receiver, sender })
          .exec((err, count) => {
            if (err) {
              console.log(err)
            }
            resolve(count)
          })
      })
    }
  }
}
