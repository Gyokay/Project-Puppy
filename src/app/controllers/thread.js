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
  .get('/:id', (req, res) => {
    let id = req.params.id;
    db.Thread.getThreadById(id)
      .then((thread) => {
        res.render('thread', {
          result: thread
        });
      })
  });


module.exports = router;

