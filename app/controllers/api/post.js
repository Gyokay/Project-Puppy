const express = require('express')
const router = express.Router()

const db = require('../../data')

const numberOfResultsPerReqest = 3

router.post('/get-latest', (req, res) => {
  db.Post.getLatest(
    numberOfResultsPerReqest,
    req.body['viewedPostsIds[]']
  )
    .then(posts => {
      res.json(posts)
    })
})

router.post('/get-by-town', (req, res) => {
  db.Post.getByTown(
    req.body.town,
    numberOfResultsPerReqest,
    req.body['viewedPostsIds[]']
  )
    .then(posts => {
      res.json(posts)
    })
})

router.post('/get-by-pet-type', (req, res) => {
  db.Post.getByPetType(
    req.body.petType,
    numberOfResultsPerReqest,
    req.body['viewedPostsIds[]']
  )
    .then(posts => {
      res.json(posts)
    })
})

router.post('/get-by-town-and-pet-type', (req, res) => {
  db.Post.getByTownAndPetType(
    req.body.town,
    req.body.petType,
    numberOfResultsPerReqest,
    req.body['viewedPostsIds[]']
  )
    .then(posts => {
      res.json(posts)
    })
})

router.post('/archive', (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({ err: 'Not Authenticated' })
    return
  }

  console.log(req.body)
  db.Post.getPostById(req.body.postId)
    .then(post => {
      if (!post) {
        res.json({ err: 'Invalid post id' })
        return
      }

      if (!post.ownerUsername === req.user.username) {
        res.json({ err: 'Not Authorized' })
        return
      }

      db.Post.updateIsArchivedById(post._id, true)
        .then(post => {
          res.json(post)
        })
    })
})

// populate DB with posts
// for testing purposes
router.get('/populate', (req, res) => {
  let postsCount = 100

  for (let i = 0; i < postsCount; i += 1) {
    db.Post.insertPost(
      'user',
      'title' + i,
      'simple description',
      'Sofia',
      'dog',
      ['http://justcuteanimals.com/wp-content/uploads/2016/07/cute-funny-pug-life-shades-summer-dogs-puppy-animal-pictures.jpg']
    )
  }
})

module.exports = router
