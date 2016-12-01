const assert = require('chai').assert
const postApi = require('../../app/controllers/api/post')
const http_mocks = require('node-mocks-http')

function buildResponse() {
  return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter })
}

describe('find controller tests', function () {
  it('should', function (done) {
    let response = buildResponse()
    let request = http_mocks.createResponse({
      method: 'POST',
      url: '/api/post/get-latest',
      params: {
        'viewedPostsIds[]': ['asdf']
      }
    })

    response.on('end', function () {
      console.log('adfadadf')
      done()
    })

    postApi.handle(request, response)
  })
})
