const express = require('express')
const path = require('path')
const port = process.env.port || 3000
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config')
// MongoDB
const mongoose = require('mongoose')

const app = express()

// Models
const UserModel = require('./models/user')

// Connect to mongoDB
mongoose.connect(config.mongoURI + '/user', { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true }, (err) => {
  if( err ) throw err;
  console.log('Mongoose connected!')
})
mongoose.Promise = global.Promise

require('./auth/auth')

// Router
const routes = require('./routes/routes')
const user = require('./routes/user')
const secureRoute = require('./routes/secure-routes')

// View Engine Pug = HTML framework
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");

// Static
app.use('/static', express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))

// Routers
app.use( '/api', passport.authenticate('jwt', { session: false }), user )
app.use( '/auth', routes ) // Register & login
app.use( '/', passport.authenticate('jwt', { session: false }), secureRoute)


// Error handler middleware
app.use((err, req, res, next) => {
  console.log("-----------------------------------------------------------------");
  console.log("__Middleware ERROR__ \n", err)
  console.log("-----------------------------------------------------------------");

  res.status(err.status || 500).json({ error: err })
})

const server = app.listen( port, () => console.info(`Server has started on port ${port}`) );

mongoose.connection.on('disconnected', () => {
  console.info('Mongose connection failed!')
  server.close(() => {
    console.log("Http server closed!")
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed!")
      process.exit(0)
    })
  })
})

// process.on('SIGTERM', () => {
//   console.info('SIGTERM signal received!')
//   console.log('Http server closing...')
//   server.close(() => {
//     console.log("Http server closed!")
//     mongoose.connection.close(false, () => {
//       console.log("MongoDB connection closed!")
//       process.exit(0)
//     })
//   })
// })