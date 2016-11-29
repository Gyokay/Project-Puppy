const express = require('express');
const router = express.Router();
const db = require('../data');

router
  .get('/', (req, res) => {
    db.Thread.getAllThreads()
      .then((threads) => {
        res.render('forum', {
          result: threads
        });
      })
  })
  .get('/create', (req, res) => {
    res.render('createThread');
  })
  .get('/:id', (req, res) => {
    let id = req.params.id;
    db.Thread.getThreadById(id)
      .then((thread) => {
        res.render('thread', {
          result: thread
        });
      })
  })
  .post('/create', (req, res) => {
    let {
      title,
      content
    } = req.body;

    db.Thread.createThread(title, content)
      .then((thread) => {
        return res.redirect(`/forum/${thread._id}`);
      })
  })
  .post('/:id', (req, res) => {
    let id = req.params.id;
    let user = req.params.user;
    let message = req.body;
    db.Thread.addMessageToThreadById(id, {message, user})
      .then((thread) => {
        res.redirect(`/forum/${thread._id}`);
      })
  });


module.exports = router;

