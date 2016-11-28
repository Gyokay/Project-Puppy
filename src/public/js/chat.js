$(function () {
  const socket = io.connect('/')
  let receiverUsername

  $('.receiver').click(function (event) {
    receiverUsername = $(event.target).text()
    // socket.emit('get messages', {receiverUsername}, function (messages) {
    //   console.log(messages)
    // })

    socket.emit('send message', { receiverUsername: 'ssssssss', msg: 'some message' })
  })

  $('.send').click(function () {
  })

  socket.on('receive message', msg => {
    console.log(msg)
  })
})
