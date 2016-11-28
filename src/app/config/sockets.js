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
    // console.log(socket.request.user.username)
    if (socket.request.isAuthenticated()) {
      // console.log(socket.request.sessionID)
      // console.log(socket.request.user.username)
      if (!connectedUsers[socket.request.user.username]) {
        connectedUsers[socket.request.user.username] = socket
      }

      db.Message.getUnseenMessagesCountByReceiver(socket.request.user.username)
        .then(count => {
          socket.emit('new messages count', count)
          // console.log(count)
        })
    }

    // console.log(connectedUsers.request.user.username)

    socket.on('send message', data => {
      //chech if such user exists
      db.Users.getUserByUsername(data.receiver)
        .then(user => {
          if (!user) {
            console.log('No such receiver username!')
            return
          }

          db.Message.insert(
            data.message,
            socket.request.user.username,
            data.receiver
          )
            .then(message => {
              // console.log(message)
              if (connectedUsers[message.receiver]) {
                connectedUsers[message.receiver]
                  .emit('receiver message', message)
              }
            })
        })
    })

    socket.on('disconnect', () => {
      // console.log(socket.request.user.username)
      delete connectedUsers[socket.request.user.username]
      // console.log(connectedUsers)
    })
  })
}
