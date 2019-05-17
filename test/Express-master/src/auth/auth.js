const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../models/user')

// Middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.create({ email, password })
    // Send the USER information to the next middleware
    return done(null, user) 
  } catch( err ) {
    done( err )
  }
}))

// Middleware to handle user login
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email })
    if( !user ) return done(null, false, { message: 'User not found.'})
    const validate = await user.isValidPassword( password )
    if( !validate ) return done(null, false, { message: 'wrong password' })
    return done( null, user, { message: 'Logged in Successfully' })
  } catch( err ) {
    return done( err )
  }
}))