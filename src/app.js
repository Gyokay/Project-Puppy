const express = require('express')
const app = express()

// view engine setup
app.set('views', './app/views')
app.set('view engine', 'pug')

// load controllers
app.use(require('./app/controllers'))

// start app
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
