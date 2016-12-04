const Post = require('../models/post')

module.exports = function (options) {
  options = options || {}

  if (!options.Post) {
    options.Post = require('../models/post')
  }

  return {
    insertPost (ownerUsername, title, description, town, petType, imgUrls) {
      return new Promise((resolve, reject) => {
        let newPost = new options.Post({
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
    },

    updateIsArchivedById (_id, isArchived) {
      return new Promise((resolve, reject) => {
        options.Post.update({ _id }, { $set: { isArchived } }, (err, post) => {
          if (err) {
            console.log(err)
          }
          resolve(post)
        })
      })
    },

    getPostById (_id) {
      return new Promise((resolve, reject) => {
        // Regular expression that checks for hex value
        var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
        let isValidId = checkForHexRegExp.test(_id)

        if (!isValidId) {
          return resolve(null)
        }

        options.Post.findOne({ _id }, (err, post) => {
          if (err) {
            console.log(err)
          }
          resolve(post)
        })
      })
    },

    getLatest (count, excludedPostIds) {
      return new Promise((resolve, reject) => {
        options.Post.find({
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
    },

    getByTown (town, count, excludedPostIds) {
      return new Promise((resolve, reject) => {
        options.Post.find({
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
    },

    getByPetType (petType, count, excludedPostIds) {
      return new Promise((resolve, reject) => {
        options.Post.find({
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
    },
    addMessageToPostById (id, { user, content, date }) {
      return new Promise((resolve, reject) => {
        Post.findOne({ _id: id }, (err, post) => {
          if (err) {
            return reject(err)
          }

          post.messages.push({ user, content, date })
          return post.save(post)
            .then(resolve)
            .catch(reject)
        })
      })
    },

    getByTownAndPetType (town, petType, count, excludedPostIds) {
      return new Promise((resolve, reject) => {
        options.Post.find({
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
  }
}

// const Post = require('../models/post')

// module.exports = {
//   insertPost,
//   getPostById,
//   updateIsArchivedById,
//   getLatest,
//   getByTown,
//   getByPetType,
//   getByTownAndPetType
// }
