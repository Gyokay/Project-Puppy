const express = require('express');
const router = express.Router();
const db = require('../data');

const DEFAULT_PAGE = 1,
  PAGE_SIZE = 10;

router
  .get('/', (req, res) => {
    let page = Number(req.query.page || DEFAULT_PAGE);

    db.Thread.getThreads({page, pageSize: PAGE_SIZE})
      .then((result => {
        let {
          threads,
          count
        } = result;

        if (count === 0) {
          return res.render("forum", {
            result: {threads, page, pages: 1},
            user: {user: req.user}
          });
        }

        if (page < 1) {
          return res.redirect("/forum?page=1");
        }

        let pages = count / PAGE_SIZE;
        if (parseInt(pages, 10) < pages) {
          pages += 1;
          pages = parseInt(pages, 10);
        }
        if (page > pages) {
          page = pages;
          return res.redirect(`/forum?page=${page}`);
        }

        return res.render("forum", {
          result: {threads, page, pages},
          user: {user: req.user}
        });
      }))
      .catch(err => {
        res.status(404)
          .send(err);
      })
  })
  // (req, res) => {
  // db.Thread.getAllThreads()
  //   .then((threads) => {
  //     res.render('forum', {
  //       result: threads
  //     });
  //   })
  // })

  .get('/create', (req, res) => {
    res.render('create-thread', {success: req.session.success, errors: req.session.errors});
    req.session.errors = [];
    req.session.save();
  })
  .get('/search', (req, res) => {
    let title = req.query.title;
    let page = Number(req.query.page || DEFAULT_PAGE);
    let user = req.user
    db.Thread.searchThreads(title, page, PAGE_SIZE)
      .then((threads) => {
        res.render('forum', {
          result: {threads},
          user: user
        });
      })
  })
  .get('/:id/modify', (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.role === 'admin') {
      db.Thread.getThreadById(id)
        .then((thread) => {
          res.render('thread-admin', {
            result: thread,
            id: id
          });
        });
    } else {
      res.redirect(`/forum/${id}`);
    }
  })
  .get('/:id', (req, res) => {
    let id = req.params.id;
    db.Thread.getThreadById(id)
      .then((thread) => {
        res.render('thread', {
          result: thread,
          user: req.user,
          errors: req.session.errors
        });
        req.session.errors = [];
        req.session.save();
      })
  })
  .post('/create', (req, res) => {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
      return;
    }
    req.checkBody('title', 'Title must be between 6 - 50 characters')
      .len(6, 50);

    req.checkBody('content', 'Content must be between 6 - 500 characters')
      .len(6, 500);

    let errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect('/forum/create');
      return;
    }

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
  .post('/:id/modify', (req, res) => {
    if (req.user.role !== 'admin') {
      res.redirect('/forum');
    }
    let id = req.params.id;
    let title = req.body.title;
    let content = req.body.content;

    if (title && content) {
      db.Thread.getThreadByIdAndUpdate(id, title, content)
        .then((thread) => {
          res.redirect(`/forum/${id}/`);
          console.log(thread);
        })
    }
  })
  .post('/:id/modify/:data', (req, res) => {
    let id = req.params.id;
    let data = req.params.data;
    let message = req.body.message;

    db.Thread.getThreadByIdAndUpdateMessages(id, data, message)
      .then((thread)=>{
      console.log(thread);
      })
  })
  .post('/:id', (req, res) => {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
      return;
    }

    let id = req.params.id;

    req.checkBody('message', 'Comment must be between 6 - 500 characters')
      .len(6, 500);

    let errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect(`/forum/${id}`);
      return;
    }

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

