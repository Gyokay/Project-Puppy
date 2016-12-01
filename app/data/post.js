const Post = require('../models/post')

function insertPost(ownerUsername, title, description, town, petType, imgUrls) {
  return new Promise((resolve, reject) => {
    let newPost = new Post({
      ownerUsername,
      title,
      description,
      town,
      petType,
      imgUrls,
      creationDate: new Date(),
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

function updateIsArchivedById(_id, isArchived) {
  return new Promise((resolve, reject) => {
    Post.update({ _id }, { $set: { isArchived } }, (err, post) => {
      if (err) {
        console.log(err)
      }
      resolve(post)
    })
  })
}

function getPostById(_id) {
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

function getLatest(count, excludedPostIds) {
  return new Promise((resolve, reject) => {
    Post.find({
      // creationDate: { $lt: new Date() },
      _id: { $nin: excludedPostIds },
      isArchived: false
    })
      .sort({ creationDate: 'desc' })
      .limit(count)
      .exec((err, posts) => {
        if (err) {
          console.log(err)
        }
        resolve(posts)
      })
  })
}

function getByTown(town, count, excludedPostIds) {
  return new Promise((resolve, reject) => {
    Post.find({
      town,
      _id: { $nin: excludedPostIds },
      isArchived: false
    })
      .sort({ creationDate: 'desc' })
      .limit(count)
      .exec((err, posts) => {
        if (err) {
          console.log(err)
        }
        resolve(posts)
      })
  })
}

function getByPetType(petType, count, excludedPostIds) {
  return new Promise((resolve, reject) => {
    Post.find({
      petType,
      _id: { $nin: excludedPostIds },
      isArchived: false
    })
      .sort({ creationDate: 'desc' })
      .limit(count)
      .exec((err, posts) => {
        if (err) {
          console.log(err)
        }
        resolve(posts)
      })
  })
}

function getByTownAndPetType(town, petType, count, excludedPostIds) {
  return new Promise((resolve, reject) => {
    Post.find({
      town,
      petType,
      _id: { $nin: excludedPostIds },
      isArchived: false
    })
      .sort({ creationDate: 'desc' })
      .limit(count)
      .exec((err, posts) => {
        if (err) {
          console.log(err)
        }
        resolve(posts)
      })
  })
}

module.exports = {
  insertPost,
  getPostById,
  updateIsArchivedById,
  getLatest,
  getByTown,
  getByPetType,
  getByTownAndPetType
}
