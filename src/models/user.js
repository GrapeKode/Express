const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/user'
const db = mongoose.createConnection(mongoURI, { useNewUrlParser: true })
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'This field is required!']
  },
  password: {
    type: String,
    required: [true, 'This field is required!']
  },
  firstName: {
    type: String,
    default: "First Name"
  },
  lastName: {
    type: String,
    default: "Last Name"
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const User = db.model('user', UserSchema)

const user = new User({
  email: "ruben.ilciuc@assist.ro",
  password: "pass123",
  firstName: "Ruben",
  lastName: "Ilciuc",
  isAdmin: true
})

db.once('connected', (err) => {
  if( err ) return console.error( err )
  User.countDocuments({isAdmin: true}, (err, count) => {
    if( err ) console.log(err.stack)
    if( !count ) {
      User.create(user, (err, doc) => {
        if( err ) return console.error( err )
        console.log(doc)
        return db.close()
      })
    }
  })
})

module.exports = User