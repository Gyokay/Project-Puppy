$(function () {
  $('#archive').click(function () {
    $.ajax({
      url: '/api/post/archive',
      method: 'POST',
      dataType: 'json',
      data: {
        postId: window.location.pathname.split('/').pop()
      },
      success: function (post) {
        if (post.ok) {
          $('#archive').replaceWith("<p class='alert success'>Successfully archived post</p>")
        }
      }
    })
  })

  // imageviewer
  $.fn.viewer
  $('.images').viewer()
})
