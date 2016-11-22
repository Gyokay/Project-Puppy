const Post = require('../models/post')

function insertPost (ownerUsername, title, description, town, petType) {
  return new Promise((resolve, reject) => {
    let newPost = new Post({
      ownerUsername,
      title,
      description,
      town,
      petType,
      date: new Date()
    })

    newPost.save((err, post) => {
      if (err) {
        console.log(err)
      }
      resolve(post)
    })
  })
}

module.exports = {
  insertPost
}
