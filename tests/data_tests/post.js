/* eslint-env mocha */

const expect = require('chai').expect

describe('Post data leyer', () => {
  let postDataLayer

  beforeEach(() => {
    postDataLayer = require('../../app/data/post')({
      Post: {
        findOne(obj, cb) {
          cb(null, obj)
        }
      }
    })
  })

  describe('getPostById', () => {
    it('should return promise and resolve if valid hex value is passed', () => {
      const testId = '583ee508937e3e1cb4fd429a'

      return postDataLayer.getPostById(testId)
        .then(obj => {
          expect(obj._id).to.equal(testId)
        })
    })

    it('should return promise and resolve to null if invalid hex value is passed', () => {
      const testId = 'foo'

      return postDataLayer.getPostById(testId)
        .then(obj => {
          expect(obj).to.equal(null)
        })
    })
  })
})
