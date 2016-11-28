const express = require('express')
const router = express.Router()

router.use('/', require('./home'))
router.use('/home', require('./home'))
router.use('/register', require('./register'))
router.use('/login', require('./login'))
router.use('/user', require('./user'))
router.use('/post', require('./post'))
router.use('/find', require('./find'))
router.use('/api', require('./api'))
router.use('/chat', require('./chat'))
router.use('/logout', require('./logout'))

module.exports = router
