$(function () {
  const socket = io.connect('/')

  socket.on('new messages count', function (count) {
    // console.log(count)
    $('.msgCount').text(count)
  })
})
