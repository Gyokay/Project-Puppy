const express = require('express')
const router = express.Router()
var io = require('socket.io')
const db = require('../data')

const pageTitle = 'Project Puppy'

// for rout specifid middleware
// router.use((req, res, next) => {
//   console.log('LOGGER')
//   next()
// })

router.get('/', (req, res) => {
  // get user ip adress
  let ip

  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0]
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress
  } else {
    ip = req.ip
  }

  console.log(ip)
  res.render('home', { user: req.user })
})

module.exports = router
