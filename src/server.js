const express = require('express')
const path = require('path')
const port = process.env.port || 3000
const bodyParser = require('body-parser')
// MongoDB
const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/user'

const app = express()

// Connect to mongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true }, (err) => {
  if( err ) throw err;
  console.log('Mongoose connected!')
})
mongoose.Promise = global.Promise

// View Engine Pug = HTML framework
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");

// Static
app.use('/static', express.static('public'));

// Body parser
app.use(bodyParser.json())

// Router
app.use( '/api', require('./routes/user') )

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(422).send({error: err.message})
  next()
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
