/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('Post data leyer', () => {
  let postDataLayer

  beforeEach(() => {
    postDataLayer = require('../../app/data/post')({
      Post: {
        findOne (obj, cb) {
          cb(null, obj)
        },
        find () {
          return {
            sort () {
              return {
                limit () {
                  return {
                    exec (cb) {
                      cb(null, [])
                    }
                  }
                }
              }
            }
          }
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

  describe('getLatest', () => {
    it('should return promise and resolve to array', () => {
      return expect(postDataLayer.getLatest()).to.eventually.be.instanceOf(Array)
    })
  })

  describe('getByTown', () => {
    it('should return promise and resolve to array', () => {
      return expect(postDataLayer.getByTown()).to.eventually.be.instanceOf(Array)
    })
  })

  describe('getByPetType', () => {
    it('should return promise and resolve to array', () => {
      return expect(postDataLayer.getByPetType()).to.eventually.be.instanceOf(Array)
    })
  })

  describe('getByTownAndPetType', () => {
    it('should return promise and resolve to array', () => {
      return expect(postDataLayer.getByTownAndPetType()).to.eventually.be.instanceOf(Array)
    })
  })
})
