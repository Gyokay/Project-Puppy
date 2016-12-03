const db = require('../data')
// const request = require('request')
// const timer = require('timers')
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
        connectedUsers[socket.request.user.username] = {
          socket,
          location: ''
        }
      }

      // let ip
      // if (socket.request.headers['x-forwarded-for']) {
      //   ip = socket.request.headers['x-forwarded-for'].split(',')[0]
      // } else if (socket.request.connection && socket.request.connection.remoteAddress) {
      //   ip = socket.request.connection.remoteAddress
      // } else {
      //   ip = socket.request.ip
      // }

      // request.get(`https://freegeoip.net/json/${ip}`, (err, res, body) => {
      //   if (err || res.statusCode !== 200) {
      //     return
      //   }

      //   let userCity = body.city

      //   if (userCity === '') {
      //     return
      //   }

      //   connectedUsers[socket.request.user.username].location = userCity
      // })

      db.Message.getUnseenMessagesCountByReceiver(socket.request.user.username)
        .then(count => {
          socket.emit('new messages count', count)
          // console.log(count)
        })
    }

    // console.log(connectedUsers.request.user.username)

    socket.on('send message', data => {
      // chech if such user exists
      db.Users.getUserByUsername(data.receiver)
        .then(user => {
          if (!user) {
            console.log('No such receiver username!')
            return
          }
          // console.log(data)

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
      // console.log(socket.request.user.username)
      delete connectedUsers[socket.request.user.username]
      // console.log(connectedUsers)
    })
  })
}
