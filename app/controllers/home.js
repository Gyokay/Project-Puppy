const express = require('express')
const router = express.Router()
var io = require('socket.io')
const db = require('../data')
const request = require('request')

const pageTitle = 'Project Puppy'

// for rout specifid middleware
// router.use((req, res, next) => {
//   console.log('LOGGER')
//   next()
// })

router.get('/', (req, res) => {
  // db.Users.getUsernamesBySubstring('f')
  //   .then(users => {
  //     console.log(users)
  //   })
  // get user ip adress

  // let ip
  // if (req.headers['x-forwarded-for']) {
  //   ip = req.headers['x-forwarded-for'].split(',')[0]
  // } else if (req.connection && req.connection.remoteAddress) {
  //   ip = req.connection.remoteAddress
  // } else {
  //   ip = req.ip
  // }

  // console.log(ip)

  // request.get(`https://freegeoip.net/json/${ip}`, (err, res, body) => {
  //   if (err || res.statusCode !== 200) {
  //     return
  //   }

  //   let userCity = body.city

  //   if (userCity === '') {
  //     return
  //   }

  //   db.Post.getByTown(userCity)
  //     .then(posts => {

  //     })
  // })

  res.render('home', { user: req.user })
})

module.exports = router
