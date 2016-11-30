$(function () {
  'use strict'

  const getLatesApiUrl = '/api/post/get-latest'
  const getByTownApiUrl = '/api/post/get-by-town/'
  const getByPetTypeApiUrl = '/api/post/get-by-pet-type'
  const getByTownAndPetTypeApiUrl = '/api/post/get-by-town-and-pet-type'

  let viewedPostsIds = []
  let noMoreResults = false

  let initialPopulate = true
  let initialPopulateCounter = 0

  // poppulate initialy
  getLatest(getLatesApiUrl, { viewedPostsIds })

  function reset() {
    viewedPostsIds = []
    noMoreResults = false

    initialPopulate = true
    initialPopulateCounter = 0
  }

  function clearPosts() {
    $('.postsContainer').empty()
  }

  $('.filter').change(function () {
    let town = $('#towns').val()
    let petType = $('#petType').val()

    // get latest if no options are selected
    if (town === null && petType === null) {
      reset()
      getLatest(getLatesApiUrl, { viewedPostsIds })
      clearPosts()
      return
    }

    // get by town
    if (town !== null && petType === null) {
      reset()
      getLatest(getByTownApiUrl, { viewedPostsIds, town })
      clearPosts()
      return
    }

    // get by pet type
    if (petType !== null && town === null) {
      reset()
      getLatest(getByPetTypeApiUrl, { viewedPostsIds, petType })
      clearPosts()
      return
    }

    // get by town and pet type
    if (town !== null && petType !== null) {
      reset()
      getLatest(getByTownAndPetTypeApiUrl, { viewedPostsIds, town, petType })
      clearPosts()
      return
    }
  })

  let $ticker = $('<img></img>')
    .addClass('ticker')
    .attr('src', '/img/ring.svg')

  $('.container').append($ticker)

  function getLatest(url, options) {
    detachOnScrollevent()

    if (noMoreResults) {
      return
    }

    $('.ticker').show()

    makeRequest(url, options)
      .then(function (posts) {
        if (
          posts.length === 0 ||
          posts === null ||
          posts === undefined
        ) {
          noMoreResults = true
          return
        }

        posts.forEach(function (post) {
          viewedPostsIds.push(post._id)
        })

        appendPostsToBody(posts)

        $('.ticker').hide()

        attachOnScrollEvent(url, options)

        if (initialPopulate) {
          getLatest(url, options)
          initialPopulateCounter++

          if (initialPopulateCounter > 3) {
            initialPopulate = false
          }
        }
      })
  }


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

  }

  function detachOnScrollevent() {
    $(window).off('scroll')
  }

  function attachOnScrollEvent(url, options) {
    // loads new elements when scrolled to he bottom of the page
    $(window).on('scroll', function () {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        getLatest(url, options)
      }
    })
  }

  function makeRequest(url, data) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url,
        method: 'POST',
        dataType: 'json',
        data,
        success: function (posts) {
          resolve(posts)
        }
      })
    })
  }
})
