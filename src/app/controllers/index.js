const express = require('express')
const router = express.Router()

router.use('/home', require('./home'))
router.use('/register', require('./register'))
router.use('/login', require('./login'))
router.use('/user', require('./user'))
router.use('/post', require('./post'))

module.exports = router
