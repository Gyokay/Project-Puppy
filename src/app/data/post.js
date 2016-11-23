const Post = require('../models/post')

function insertPost (ownerUsername, title, description, town, petType, imgUrls) {
  return new Promise((resolve, reject) => {
    let newPost = new Post({
      ownerUsername,
      title,
      description,
      town,
      petType,
      imgUrls,
      date: new Date(),
      isArchived: false
    })

    newPost.save((err, post) => {
      if (err) {
        console.log(err)
      }
      resolve(post)
    })
  })
}

function getPostById (_id) {
  return new Promise((resolve, reject) => {
    // Regular expression that checks for hex value
    var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
    let isValidId = checkForHexRegExp.test(_id)

    if (!isValidId) {
      return resolve(null)
    }

    Post.findOne({ _id }, (err, post) => {
      if (err) {
        console.log(err)
      }
      resolve(post)
    })
  })
}

module.exports = {
  insertPost,
  getPostById
}
