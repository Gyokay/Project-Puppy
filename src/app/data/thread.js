const Thread = require('../models/thread');

module.exports = {
  createThread(title, content){
    let thread = new Thread({
      title,
      content,
      dateTime: new Date()
    });

    return new Promise((resolve, reject) => {
      thread.save((err, thread) => {
        if (err) {
          return reject(err);
        }

        return resolve(thread);
      })
    })
  },
  getAllThreads(){
    return new Promise((resolve, reject) => {
      Thread.find((err, threads) => {
        if (err) {
          return reject(err);
        }

        return resolve(threads);
      })
    })
  },
  addMessageToThreadByTitle(title, message){
    return new Promise((resolve, reject) => {
      Thread.findOne({title}, (err, thread) => {
        if (err) {
          return reject(err);
        }

        thread.messages.push(message);
        return thread.save(thread)
          .then(resolve)
          .catch(reject);
      })
    })
  },
  getThreadById(id){
    return new Promise((resolve, reject) => {
      Thread.findOne({
        _id: id
      }, (err, thread) => {
        if (err) {
          return reject(err);
        }

        return resolve(thread);
      })
    })
  }
};