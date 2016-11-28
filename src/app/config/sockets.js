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
      console.log(socket.request.sessionID)
      // console.log(socket.request.user.username)
      if (!connectedUsers[socket.request.user.username]) {
        connectedUsers[socket.request.user.username] = socket
      }
    }

    // console.log(connectedUsers.request.user.username)
    // socket.on('get messages', (username, fn) => {
    //   db.Message.getAllBySenderAndReceiver(username, socket.request.user.username)
    //     .then(messages => {

    //     })
    // })

    socket.on('send message', data => {
      console.log(data)
      if (connectedUsers[data.receiverUsername]) {
        connectedUsers[data.receiverUsername].emit('receive message', data.msg)
      }

    })

    // console.log(connectedUsers)
    socket.on('disconnect', () => {
      delete connectedUsers[socket.request.user.username]
      // console.log(connectedUsers)
    })
  })
}
