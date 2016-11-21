const express = require('express')
const router = express.Router()

router.use('/home', require('./home'))
router.use('/register', require('./register'))

module.exports = router
