const express = require('express')
const router = express.Router()

router.use('/post', require('./post'))
router.use('/message', require('./message'))
router.use('/user', require('./user'))

module.exports = router
