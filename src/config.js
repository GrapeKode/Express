const fs = require('fs')

// PRIVATE and PUBLIC Key
const privateKEY = fs.readFileSync('./private.key', 'utf8')
const publicKEY = fs.readFileSync('./public.key', 'utf8')

let i = 'Authentication API'           // Issuer
let s = 'some@user.com'         // Subject 
let a = 'User_Identity' // Audience
// SIGNING OPTIONS
const signOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: '12h',
  algorithm: 'RS256'
}


module.exports = {
  secret: {
    sample: '$_R4I.u1l.B2C.e7i.UNc_$',
    privateKEY,
    publicKEY,
    signOptions
  },
  mongoURI: 'mongodb://localhost:27017'
}