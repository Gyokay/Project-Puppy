const express = require('express')
const router = express.Router()

const db = require('../data')

router.get('/', (req, res) => {

  // DON'T DELETE - uncomment in production
  // if (!req.user) {
  //   res.redirect('/login')
  // }

  res.render('create-post')
})

router.post('/', (req, res) => {
  // DON'T DELETE - uncomment in production
  // if (!req.user) {
  //   res.redirect('/login')
  // }

  // console.log(req.body)
  // console.log(req.user.username)

  // TO DO: validations:
  // post validtions:
  // file size and extention
  // upload images and provede array of urls

  db.Post.insertPost(
    req.user.username,
    req.body.title,
    req.body.description,
    req.body.town,
    req.body.petPtype,
    req.body.img
  ).then(post => {
    // redirect to the post page
  })
})

module.exports = router
