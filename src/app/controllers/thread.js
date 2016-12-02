const express = require('express');
const router = express.Router();
const db = require('../data');

const DEFAULT_PAGE = 1,
  PAGE_SIZE = 10;

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
  .get('/search', (req, res) => {
    let title = req.query.title;
    let page = Number(req.query.page || DEFAULT_PAGE);
    db.Thread.searchThreads(title, page, PAGE_SIZE)
      .then((threads)=>{
        res.render('forum', {
          result: threads
        });
      })
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
    let username = req.user.username;

    db.Thread.createThread(title, content, username)
      .then((thread) => {
        return res.redirect(`/forum/${thread._id}`);
      })
  })
  .post('/:id', (req, res) => {
    let id = req.params.id;
    let user = req.user.username;
    let content = req.body;
    db.Thread.addMessageToThreadById(
      id,
      {
        user,
        content,
        date: new Date()
      }
    )
      .then((thread) => {
        res.redirect(`/forum/${thread._id}`);
      })
  });


module.exports = router;

