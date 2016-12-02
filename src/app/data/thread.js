const Thread = require('../models/thread');
const regex = require('mongoose-regex');
const MIN_LENGTH = 3;

module.exports = {
  createThread(title, content, username){
    let thread = new Thread({
      title,
      content,
      dateTime: new Date(),
      username
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
  addMessageToThreadById(id, {user, content, date}){
    return new Promise((resolve, reject) => {
      Thread.findOne({_id: id}, (err, thread) => {
        if (err) {
          return reject(err);
        }

        thread.messages.push({user, content, date});
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
  },
  searchThreads(pattern, page, pageSize) {
    let searchOptions = {
      fieldToSearch: 'title',
      caseSensitive: false
    };

    return new Promise((resolve, reject) => {
      Thread.regexSearch(pattern, searchOptions, (err, result) => {
        if (err){
          return reject(err);
        }

        return resolve(result);
      })
    })
  }
};