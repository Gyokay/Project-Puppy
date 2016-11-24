const express = require('express')
const router = express.Router()

const db = require('../../data')

const numberOfResultsPerReqest = 3

router.post('/get-latest', (req, res) => {
  console.log(req.body)
  db.Post.getLatest(numberOfResultsPerReqest, req.body['viewedPostsIds[]'])
    .then(posts => {
      // console.log(posts)
      res.send(posts)
    })
})

// populate DB with posts
// for testing purposes
router.get('/populate', (req, res) => {
  let postsCount = 100

  for (let i = 0; i < postsCount; i += 1) {
    db.Post.insertPost(
      'user',
      'some title',
      'simple description',
      'София',
      'cat',
      ['http://justcuteanimals.com/wp-content/uploads/2016/07/cute-funny-pug-life-shades-summer-dogs-puppy-animal-pictures.jpg']
    )
  }
})

module.exports = router
