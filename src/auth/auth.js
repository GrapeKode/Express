const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../models/user')
const config = require('../config')
const jwt = require('jsonwebtoken')
const cache = require('memory-cache')

// Passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    let check = await UserModel.findOne({ email })
    console.log("Check: ", check)
    if( check ) return done(null, false, { status: 400, message: `Utilizatorul cu email-ul ${email} exista deja.` })
    else {
      const user = await UserModel.create({ email, password });
      return done(null, user)
    }
  } catch( error ) {
    done({ message: error.message });
  }
}))

// Passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email: email })
    if( !user ) return done(null, false, { status: 404, message: 'User not found' })
    const validate = await user.isValidPassword( password )
    if( !validate ) return done(null, false, { status: 400, message: 'Wrong password'})
    return done(null, user, { message: 'Logged in Successfully'})
  } catch( error ) {
    return done( error )
  }
}))

// Verifying the user token
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use('jwt', new JWTstrategy({
  secretOrKey: config.secret.publicKEY, // Public Key
  jwtFromRequest: ExtractJWT.fromHeader('x-auth')
}, (token, done) => {
  try {
    let cache_token = cache.get(token.user._id)

    if( !cache_token ) 
      return done(null, false, { message: 'Authentication failed' })
    else {
      let cache_iat = jwt.decode(cache_token).iat
      if( cache_iat !== token.iat )
        return done(null, false, { message: 'Authentication failed' })
      return done(null, token.user)
    }
  } catch( err ) {
    done( err )
  }
}))