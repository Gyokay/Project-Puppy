const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const expressValidator = require('express-validator')
const expressSession = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

const app = express()

// mongoose setup
mongoose.Promise = global.Promise // prevents the "depecated promise" message
mongoose.connect('mongodb://localhost/ProjectPuppyDB')
mongoose.connection
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', () => console.log('DB connection successful!'))

// passport configurations
require('./app/config/passport')

// view engine setup
app.set('views', './app/views')
app.set('view engine', 'pug')

// middleware
// app.use((req, res, next) => {
//   console.log('Woohoo')
//   next()
// })

// serve public resources
app.use(express.static(path.join(__dirname, '/public')))

// body-parser setup
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// express-validator setup
app.use(expressValidator())

// express-session setup
app.use(expressSession({
  secret: 'everything small is just a small version of something big',
  saveUninitialized: false,
  resave: false
}))

// falsh setup
app.use(flash())

// passport setup
app.use(passport.initialize())
app.use(passport.session())

// load controllers
app.use(require('./app/controllers'))

// start app
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
