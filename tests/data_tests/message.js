/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('Message data layer', () => {
  let messageDataLayer

  beforeEach(() => {
    messageDataLayer = require('../../app/data/message')({
      Message: {
        find () {
          return {
            distinct () {
              return {
                where () {
                  return {
                    equals () {
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
        },
        update (objFirst, objSecond, cb) {
          cb(null, objFirst)
        },
        count () {
          return {
            where () {
              return {
                exec (cb) {
                  cb(null, 42)
                }
              }
            }
          }
        }
      }
    })
  })

  describe('updateToSeenById', () => {
    it('should return promise and resolve', () => {
      let testId = 'foo'

      return expect(messageDataLayer.updateToSeenById(testId))
        .to.eventually.become({ _id: testId })
    })
  })

  describe('getUnseenMessagesCountByReceiver', () => {
    it('should return promise and resolve', () => {
      let result = messageDataLayer.getUnseenMessagesCountByReceiver()

      return Promise.all([
        expect(result)
          .to.eventually.be.a('number'),
        expect(result.then(c => c % 1)).to.eventually.equal(0)
      ])
    })
  })

  describe('getAllUniqueSenderNamesByReceaver', () => {
    it('should return promise and resolve', () => {
      let result = messageDataLayer.getAllUniqueSenderNamesByReceaver()

      return expect(result).to.eventually.be.instanceof(Array)
    })
  })

  describe('getAllUniqueReceiverNamesBySender', () => {
    it('should return promise and resolve', () => {
      let result = messageDataLayer.getAllUniqueReceiverNamesBySender()

      return expect(result).to.eventually.be.instanceof(Array)
    })
  })
})
