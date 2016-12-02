const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const flash = require('connect-flash')
const server = require('http').Server(app)

// mongoose setup
mongoose.Promise = global.Promise // prevents the "depecated promise" message

const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
}

// producton db connection string
// mongodb://puppy:project-puppy@ds163667.mlab.com:63667/projectpuppy
const mongodbUri = 'mongodb://localhost/ProjectPuppyDB'
mongoose.connect(mongodbUri, options)

mongoose.connection
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', () => console.log('DB connection successful!'))

var sessionStore = new MongoDBStore(
  {
    uri: mongodbUri,
    collection: 'mySessions'
  })

app.use(session({
  key: 'express.sid',
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}))

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
app.use(bodyParser.urlencoded({ extended: false }))

// express-validator setup
app.use(expressValidator())

// falsh setup
app.use(flash())

// passport setup
app.use(passport.initialize())
app.use(passport.session())

require('./app/config/sockets')(server, sessionStore, cookieParser)

// load controllers
app.use(require('./app/controllers'))

// error handler
// app.use((err, req, res, next) => {

// })

// start app
server.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port 3000!')
})
