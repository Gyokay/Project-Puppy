/* eslint-env mocha */

const expect = require('chai').expect

describe('User data layer', () => {
  let userDataLayer

  beforeEach(() => {
    userDataLayer = require('../../app/data/user')({
      User: {
        findOne (obj, cb) {
          cb(null, obj)
        },
        find () {
          return {
            select () {
              return {
                exec (cb) {
                  cb(null, [])
                }
              }
            }
          }
        }
      }
    })
  })

  describe('getUserByUsername', () => {
    it('should return promise and resolve to correct user', () => {
      const testUsername = 'someUsername'

      return userDataLayer.getUserByUsername(testUsername)
        .then(obj => {
          expect(obj.username).to.equal(testUsername)
        })
    })
  })

  describe('getUserBySubstrng', () => {
    it('should return promise and resolve to array', () => {
      const testSubstring = 'foo'

      return userDataLayer.getUsernamesBySubstring(testSubstring)
        .then(users => {
          expect(users).to.be.instanceof(Array)
        })
    })
  })

  describe('getUserByEmail', () => {
    it('should return promise and resolve to correct user email', () => {
      const testEmail = 'foo@bar.baz'

      return userDataLayer.getUserByEmail(testEmail)
        .then(obj => {
          expect(obj.email).to.equal(testEmail)
        })
    })
  })
})
