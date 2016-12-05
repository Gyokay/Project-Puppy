$(function () {
  const socket = io.connect('/')
  let chatSound = new Audio('/audio/pop.mp3')
  let receiver


  $(document).on('click', '.receiver', function (event) {
    if (receiver === $(event.target).text()) {
      return
    }

    $('.receiver').removeClass('button-primary')

    $(event.target)
      .removeClass('newMessage')
      .addClass('button-primary')

    $('#chat').empty()

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

  function getNewMessagesCount(senders) {
    if (!senders) {
      return
    }

    $.ajax({
      url: '/api/message/get-new-message-count',
      method: 'POST',
      dataType: 'json',
      data: {
        senders
      },
      success: function (data) {
        appendUnseenCount(data)
      }
    })
  }

  function appendUnseenCount(data) {
    data.forEach(function (item) {
      let currentElement = $('.receiver').filter(function () {
        return $(this).text() === item.sender && item.count > 0
      })

      currentElement.addClass('newMessage')
    })
  }

  getNewMessagesCount(getAllSenderUsernames())

  function getAllSenderUsernames() {
    let senderUsernames = []

    $('.receiver').each(function (index, element) {
      senderUsernames.push($(element).text())
    })

    // console.log(senderUsernames)
    return senderUsernames
  }

  $(window).focus(function () {
    if (!receiver) {
      return
    }

    socket.emit('seen', { receiver })
  })

  $('.send').keypress(function (e) {
    if (e.which === 13) {
      let $target = $(e.target)
      let message = $target.val().trim()

      if (message === '') {
        return
      }

      $target.val('')

      // console.log($(e.target).val())
      socket.emit('send message', { receiver, message })

      appendSingleMessage({ receiver, message, sentOn: new Date() })
    }
  })

  socket.on('receiver message', message => {
    chatSound.play()

    if (receiver !== message.sender) {
      let currentReceiver = $('.receiver').filter(function () {
        return $(this).text() === message.sender
      })

      if (currentReceiver.is('.button')) {
        currentReceiver.addClass('newMessage')
      } else {
        addReceiverButton(message.sender, true)
      }

      // console.log(currentReceiver)
      return
    }

    // console.log(message)
    appendSingleMessage(message)
  })

  function appendMessages(messages) {
    messages.forEach(function (message) {
      appendSingleMessage(message)
    })

    $('.send').css('visibility', 'visible')
  }

  function appendSingleMessage(message) {
    let $li = $('<li></li>')
    let $msgContainer = $('<div></div>').addClass('msg')
    let $msg = $('<p></p>').text(message.message)
    let $time = $('<time></time>').text(message.sentOn.toLocaleString())
    // console.log(message.time)
    // if (!message.receiver) {
    //   $li.addClass('self')
    // }

    if (message.receiver === receiver) {
      $li.addClass('self')
    } else {
      $li.addClass('other')
    }

    $msgContainer.append($msg)
    $msgContainer.append($time)
    $li.append($msgContainer)
    $('#chat').append($li)

    scrollToBotton()
  }

  function scrollToBotton() {
    $('#chat').scrollTop(10000)
  }

  // user search logic

  $('#searchUser').on('input', function (e) {
    let substring = $(e.target).val()

    if (substring === '') {
      return
    }

    if (substring.length < 3) {
      return
    }

    $.ajax({
      url: '/api/user/usernames-by-substring',
      method: 'POST',
      dataType: 'json',
      data: {
        substring
      },
      success: function (usernames) {
        // console.log(usernames)
        let isSingle = false

        if (usernames.length === 1) {
          isSingle = true
        }

        let $usernamesEl = $('#usernames')
        $usernamesEl.empty()

        usernames.forEach(function (username) {
          let $option = $('<option></option>')
            .addClass('usernameOption')
            .text(username.username)
            .val(username.username)

          if (isSingle) {
            $option.attr('selected', 'selected')
          }

          $usernamesEl.append($option)
        })
      }
    })
  })

  $('#usernames').click(function (e) {
    let $target = $(e.target)

    if ($target.children().length === 0) {
      return
    }

    let isPresent = $('.receiver').filter(function () {
      return $(this).text() === $target.val()
    })

    if ($target.val() === null || '') {
      return
    }

    // console.log(isPresent)

    if (isPresent.length > 0) {
      return
    }

    addReceiverButton($target.val())
  })

  function addReceiverButton(username, isNewMessage) {
    let $pEl = $('<button></button>').addClass('receiver button').text(username)

    if (isNewMessage) {
      $pEl.addClass('newMessage')
    }

    $('.usernamesContainer').prepend($pEl)
  }
})
