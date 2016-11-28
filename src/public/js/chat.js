$(function () {
  const socket = io.connect('/')
  let receiver

  $('.receiver').click(function (event) {
    if (receiver === $(event.target).text()) {
      return
    }

    $('.chat').empty()

    receiver = $(event.target).text()

    $.ajax({
      url: '/api/message/getConversation',
      method: 'POST',
      dataType: 'json',
      data: {
        receiver
      },
      success: function (messages) {
        // console.log(messages)
        appendMessages(messages)
      }
    })
  })

  $('.send').keypress(function (e) {
    if (e.which === 13) {
      let $target = $(e.target)
      let message = $target.val()
      $target.val('')

      // console.log($(e.target).val())
      socket.emit('send message', { receiver, message })

      appendSingleMessage({ message })
    }
  })

  socket.on('receiver message', message => {
    // console.log(message)
    appendSingleMessage(message)
  })

  function appendMessages (messages) {
    messages.forEach(function (message) {
      appendSingleMessage(message)
    })
  }

  function appendSingleMessage (message) {
    let $li = $('<li></li>')
    let $msgContainer = $('<div></div>').addClass('msg')
    let $msg = $('<p></p>').text(message.message)

    if (message.receiver === receiver) {
      $li.addClass('self')
    } else {
      $li.addClass('other')
    }

    $msgContainer.append($msg)
    $li.append($msgContainer)
    $('.chat').append($li)
  }

  function scrollToBotton () {
    // to do
  }
})
