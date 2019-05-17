const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const blacklist = require('express-jwt-blacklist')
const cache = require('memory-cache')
// Models

const router = express.Router()

// Registretion
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.json({
    user: req.user,
    message: 'Signup successful'
  })
})
// router.post('/signup', async (req, res, next) => {
//   passport.authenticate('signup', async (err, user, info) => {
//     if( err ) return next({ status: info.status, message: info.message })
//     if( !user ){
//       return next({ message: `Nu s-a putut inregistra user-ul.` })
//     } else {
//       res.json({
//         user: req.user,
//         message: 'Signup successful'
//       })
//     }
//   })
// })

// Login
router.post('/login', async (req, res, next) => {
  //console.log("REQ:", req.body)
  passport.authenticate('login', async (err, user, info) => {
    try {
      if( err || !user ) {
        return next({ status: info.status, message: info.message })
      }
      req.login(user, { session: false }, error => {
        if( error ) return next( error )
        const body = { _id: user._id, email: user.email, isAdmin: user.isAdmin }
        const token = jwt.sign({ user: body }, config.secret )

        // Add the token to whitelist
        let iat = jwt.decode(token).iat
        let jti = cache.get(iat)
        // Replace old token
        if( !jti )
          cache.put(iat, token)
        else if( jti !== token )
          cache.put(iat, token)

        return res.json({ 
          token,
          info
        })
      })
    } catch( err ) {
      return next( err )
    }
  })(req, res, next)
})

// Logout
router.get('/logout', async (req, res, next) => {
  let jti = jwt.decode(req.header('x-auth')).iat // 4
  // let cache_jwt = cache.get(jti)
  cache.del(jti)
  res.json({ user: req.user, message: 'Logged out' })
})

module.exports = router