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
  },
  getThreads({ page, pageSize }) {
    let skip = (page - 1) * pageSize,
      limit = page * pageSize;

    return Promise.all([
      new Promise((resolve, reject) => {
        Thread.find()
          .sort({name: 1})
          .skip(skip)
          .limit(limit)
          .exec((err, threads) => {
            if (err) {
              return reject(err);
            }

            return resolve(threads);
          });
      }), new Promise((resolve, reject) => {
        Thread.count({})
          .exec((err, count) => {
            if (err) {
              return reject(err);
            }

            return resolve(count);
          });
      })
    ]).then(results => {
      let [threads, count] = results;
      return {threads, count};
    });
  },
  getThreadByIdAndUpdate(id, title, content){
    return new Promise((resolve, reject) => {
      Thread.findOneAndUpdate(
        {_id: id},
        {$set:{title:title, content: content}},
        {new: true},
        (err, thread) => {
        if (err) {
          return reject(err);
        }

        return resolve(thread);
      })
    })
  },
  getThreadByIdAndUpdateMessages(id, date, message){
    return new Promise((resolve, reject) => {
      Thread.findOneAndUpdate(
        {_id: id, "messages": {date}},
        {$set: {"messages$": {content: {message: message}}}},
        {new: true},
        (err, thread) => {
          if (err) {
            return reject(err);
          }

          return resolve(thread);
        })
    })
  }
};