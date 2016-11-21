const express = require('express')
const router = express.Router()
const db = require('../data')

const pageTitle = 'Project Puppy'

// for rout specifid middleware
// router.use((req, res, next) => {
//   console.log('LOGGER')
//   next()
// })

router.get('/', (req, res) => {
  
})

module.exports = router
