const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '/uploads') })
const fs = require('fs')
const request = require('request')

const db = require('../data')

const fileInputName = 'img'
const allowedImagesCount = 4

const uploadImgsErrorMsg = 'There was problem uploding the images. Please try again.'

router.get('/create-post', (req, res) => {
  // DON'T DELETE - uncomment in production
  // if (!req.isUnauthenticated()) {
  //   res.redirect('/login')
  // }

  res.render('create-post')
})

router.post('/create-post',
  upload.array(fileInputName, allowedImagesCount),
  (req, res) => {
    // DON'T DELETE - uncomment in production
    // if (!req.isUnauthenticated()) {
    //   res.redirect('/login')
    // }

    // TO DO validations:
    // on post:
    // file size and extention

    function insertPostToDB () {
      // add new post to DB
      db.Post.insertPost(
        'USER', // hard coded username for test purposes. change in production !!!
        req.body.title,
        req.body.description,
        req.body.town,
        req.body.petType,
        imgUrls
      ).then(post => {
        res.redirect(`/post/${post._id}`)
      })
    }

    let imgUrls = []

    let filesCount = req.files.length
    let asyncCount = 0

    // options for the requester
    // contains IMGUR api url and Client-ID
    let options = {
      method: 'POST',
      url: 'https://api.imgur.com/3/upload',
      headers: {
        Authorization: 'Client-ID 9e21e0b5881553f'
      }
    }

    // can be extracted to another file
    // upload images to third party
    new Promise((resolve, reject) => {
      // Check if photos are available in the request body
      if (filesCount <= 0) {
        insertPostToDB()
        return
      }

      req.files.forEach(file => {
        fs.createReadStream(file.path)
          .pipe(request(options, (err, response, body) => {
            if (err) {
              console.log(err)
              res.redirect('/post/create-post', { error: uploadImgsErrorMsg })
              return
            }

            if (!err && response.statusCode === 200) {
              let bodyObj = JSON.parse(body)
              let imgLink = bodyObj.data.link

              imgUrls.push(imgLink)
              asyncCount++

              if (asyncCount === filesCount) {
                resolve()
              }
            }
          }))
      })
    })
      .then(() => {
        // console.log(imgUrls)
        // delete images from the file system
        req.files.forEach(file => {
          fs.unlink(file.path)
        })

        insertPostToDB()
      })
  })

router.get('/:postId', (req, res) => {
  db.Post.getPostById(req.params.postId)
    .then(post => {
      if (!post) {
        res.render('not-found')
        return
      }

      res.render('view-post', {
        title: post.title,
        description: post.description,
        ownerUsername: post.ownerUsername,
        town: post.town,
        petPype: post.petPtype,
        imgUrls: post.imgUrls,
        isArchived: post.isArchived
      })
    })
})

module.exports = router
