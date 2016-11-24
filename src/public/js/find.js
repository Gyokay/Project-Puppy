$(() => {
  'use strict'

  let viewedPostsIds = []
  let noMoreResults = false

  let initialPopulate = true
  let initialPopulateCounter = 0

  function getMorePosts() {
    detachOnScrollevent()

    if (noMoreResults) {
      return
    }

    $.ajax({
      url: 'api/post/get-latest',
      method: 'POST',
      dataType: 'json',
      data: {
        viewedPostsIds
      },
      success: posts => {
        if (
          posts.length === 0 ||
          posts === null ||
          posts === undefined
        ) {
          noMoreResults = true
          return
        }

        posts.forEach(post => {
          viewedPostsIds.push(post._id)
        })
        // console.log(posts)
        appendPostsToBody(posts)

        attachOnScrollEvent()

        if (initialPopulate) {
          getMorePosts()
          initialPopulateCounter++

          if (initialPopulateCounter === 3) {
            initialPopulate = false
          }
        }
      }
    })
  }

  function appendPostsToBody(posts) {
    let $container = $('.container')
    let $row = $('<div></div>').addClass('row')

    posts.forEach(post => {
      let $oneThirdColumn = $('<div></div>').addClass('one-third column')
      let $anchor = $('<a></a>').attr('href', `/post/${post._id}`)
      let $imgContainer = $('<div></div>').addClass('image')
      let $imgElement = $('<img>').attr('src', post.imgUrls[0]).addClass('object-fit_cover u-full-width')
      let $title = $('<p></p>')
        .append($('<h3></3>').text(post.title))

      $imgContainer.append($imgElement)
        .append($title)
      $anchor.append($imgContainer)
      $oneThirdColumn.append($anchor)
      $row.append($oneThirdColumn)
    })

    $container.append($row)
  }

  function detachOnScrollevent() {
    $(window).off('scroll')
  }

  function attachOnScrollEvent() {
    // loads new elements when scrolled to he bottom of the page
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        getMorePosts()
      }
    })
  }

  // click to load new elements
  // for testing purposes
  // $('.container').click(() => {
  //   console.log('ckicked')
  //   getMorePosts()
  // })

  // poppulate initialy
  getMorePosts()
})
