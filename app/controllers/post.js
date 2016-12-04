const constants = require('../common/constants')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '/../../uploads') })
const fs = require('fs')
const request = require('request')

const db = require('../data')

router.get('/create-post', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login')
        return
    }

    res.render('create-post', {
        success: req.session.success,
        errors: req.session.errors,
        title: req.session.title,
        description: req.session.description
    })

    req.session.title = null
    req.session.description = null
    req.session.errors = []
    req.session.save()
})

router.post('/create-post',
    upload.array(constants.fileInputName, constants.allowedImagesCount),
    (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
            return
        }

        req.sanitize('title').trim()
        req.sanitize('description').trim()

        // Validation
        req.checkBody('title', 'Title must be between ' + constants.minPostTitleLenght + ' and ' + constants.maxPostTitleLenght + ' characters')
            .len(constants.minPostTitleLenght, constants.maxPostTitleLenght)
        req.checkBody('description', 'Description must be between ' + constants.minPostDescriptionLenght + ' and ' + constants.maxPostDescriptionLenght + ' characters')
            .len(constants.minPostDescriptionLenght, constants.maxPostDescriptionLenght)

        let errors = req.validationErrors()

        if (errors) {
            req.session.errors = errors
            req.session.success = false
            req.session.title = req.body.title
            req.session.description = req.body.description
            res.redirect('/post/create-post')
            return
        }

        function insertPostToDB() {
            // add new post to DB
            db.Post.insertPost(
                req.user.username,
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
                                res.redirect('/post/create-post', { error: constants.uploadImgsErrorMsg })
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

                let isOwner = false

                if (req.isAuthenticated()) {
                    if (req.user.username === post.ownerUsername) {
                        isOwner = true
                    }
                }

                res.render('view-post', {
                    user: req.user,
                    title: post.title,
                    description: post.description,
                    date: post.creationDate.toDateString(),
                    ownerUsername: post.ownerUsername,
                    town: post.town,
                    petType: post.petType,
                    imgUrls: post.imgUrls,
                    isArchived: post.isArchived,
                    messages: post.messages,
                    isOwner,
                    _id: post._id
                })
            })
    })
    .post('/:postId', (req, res) => {
        let id = req.params.postId
        let user = req.user.username
        let content = req.body
        db.Post.addMessageToPostById(
                id, {
                    user,
                    content,
                    date: new Date()
                }
            )
            .then((post) => {
                res.redirect(`/post/${post._id}`)
            })
    })

module.exports = router