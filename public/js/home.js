const socket = io.connect('/')

socket.on('new messages count', function (count) {
  // console.log(count)
  $('.msgCount').text(count)
})

socket.on('new post', function (posts) {
  // console.log(posts)
  // let $latestPostsContainer = $('<div></div>').addClass('latestPostsContainer')

  appendPostsToBody(posts)
})

function appendPostsToBody(posts) {

  let $container = $('.postsContainer')
  let $row = $('<div></div>').addClass('row')

  posts.forEach(function (post) {
    let $oneThirdColumn = $('<div></div>').addClass('one-third column')
    let $anchor = $('<a></a>').attr('href', `/post/${post._id}`)
    let $imgContainer = $('<div></div>').addClass('image')
    let $imgElement = $('<img>').attr('src', post.imgUrls[0]).addClass('postImg object-fit_cover u-full-width')
    let $title = $('<p></p>')
      .append($('<h3></3>').text(post.title))

    $imgContainer.append($imgElement)
      .append($title)
    $anchor.append($imgContainer)
    $oneThirdColumn.append($anchor)
    $row.append($oneThirdColumn)
  })

  $container.append($row)
  $('.container').append($container)
}

