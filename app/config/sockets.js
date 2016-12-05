const db = require('../data')
let connectedUsers = {}

module.exports = (server, sessionStore, cookieParser) => {
  const io = require('socket.io')(server)
  const passportSocketIo = require('passport.socketio')

  io.use(passportSocketIo.authorize({
    cookieParser,
    key: 'express.sid',
    secret: 'This is a secret',
    store: sessionStore
  }))


  io.on('connection', socket => {
    if (socket.request.isAuthenticated()) {
      if (!connectedUsers[socket.request.user.username]) {
        connectedUsers[socket.request.user.username] = {
          socket,
          location: ''
        }
      }

      db.Message.getUnseenMessagesCountByReceiver(socket.request.user.username)
        .then(count => {
          socket.emit('new messages count', count)
        })
    }

    socket.on('send message', data => {
      // chech if such user exists
      db.Users.getUserByUsername(data.receiver)
        .then(user => {
          if (!user) {
            console.log('No such receiver username!')
            return
          }

          if (connectedUsers[data.receiver]) {
            connectedUsers[data.receiver].socket
              .emit('receiver message', {
                receiver: data.receiver,
                sender: socket.request.user.username,
                message: data.message,
                sentOn: new Date().toLocaleString()
              })
          }

          db.Message.insert(
            data.message,
            socket.request.user.username,
            data.receiver
          )
        })
    })

    socket.on('seen', data => {
      db.Message.updateAllToSeenByReceiverAndSender(
        socket.request.user.username,
        data.receiver
      )
    })

    socket.on('disconnect', () => {
      delete connectedUsers[socket.request.user.username]
    })
  })
}
