$(function () {
  const socket = io.connect('/')

  socket.on('new messages count', function (count) {
    // console.log(count)
    let $msgCount = $('.msgCount')
    let $chatLink = $('.chatLink')
    $msgCount.text(count)
    if (count > 0) {
      $msgCount.addClass('red')

      if (count === 1) {
        $chatLink.text('message')
      }
    } else {
      $msgCount.removeClass('red')
      $chatLink.text('messages')
    }
  })
})
