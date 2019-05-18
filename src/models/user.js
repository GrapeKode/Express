const mongoose = require('mongoose')
const config = require('../config')
const db = mongoose.createConnection(config.mongoURI + '/user', { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true })
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'This field is required!'],
    unique: true
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

// This is called a pre-hook, before the user information is saved in the database
// this function will be called, we'll get the plain text password, hash it and store it.
UserSchema.pre('save', async function(next) {
  const user = this
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

// We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the 
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const User = mongoose.model('user', UserSchema) // db

const user = new User({
  email: "ruben.ilciuc@assist.ro",
  password: "R4u1B2e7N",
  firstName: "Ruben",
  lastName: "Ilciuc",
  isAdmin: true
})

db.once('connected', async (err) => {
  if( err ) return console.error( err )
  await User.countDocuments({isAdmin: true}, async (err, count) => {
    if( err ) console.log(err.stack)
    if( !count ) {
      await User.create(user, async (err, doc) => {
        if( err ) return console.error( err )
        console.log(doc)
        return db.close()
      })
    }
  })
})

module.exports = User