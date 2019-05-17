const express = require('express')
const router = express.Router()
const User = require('../models/user')

const { check, validationResult } = require('express-validator/check');

// Get limited users
router.get('/user', (req, res, next) => {
  if( req.query.limit ) {
    User.findOne({ _id: req.user._id })
      .exec((err, user) => {
        if( err ) return next({ message: err.message })
        if( !user ) return next({ status: 401, message: 'Token-ul de autentificare este invalid.' })
        else
          User.find( {} )
            .limit( parseInt(req.query.limit) )
            .exec((err, users) => {
              if( err ) return next({ message: err.message })
              if( !users ) return res.json({ status: 200, message: 'Nu exista utilizatori.' })
              res.json( { users })
            })
      })
  } else {
    //console.log("USER: ", req.user)
    return next({ message: 'Nu exista informatii suficiente pentru aceasta cerere.' })
  }
})

// Get user by id 
router.get('/user/:id', (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .exec((err, user) => {
      console.log("GET_ID: ", user)
      if( err ) return next({ message: "Nu s-au putut procesa informatiile." })
      if( !user ) 
        return next({ status: 200, message: `Utilizatorul cu id-ul ${req.params.id} nu exista in baza de date.` })
      else return res.json(user)
    })
})

// Get user by email
router.get('/userByEmail/:email', (req, res, next) => {
  User.findOne({email: req.params.email})
    .exec((err, user) => {
      if( !err ) {
        if( !user ) return next({ status: 200, error: `Utilizatorul cu email-ul ${req.params.email} nu exista in baza de date.` })
        else return res.json(user)
      }
    })
})

// Post new user JSON
router.post('/user', (req, res, next) => {
  // const errors = validationResult(req);
  // if ( !errors.isEmpty() ) return res.status(422).json({ errors: errors.array() });
  // if( req.body.isAdmin ) return res.json({error: `Nu aveti permisiunea de a adauga un admin.`})
  User.findOne({email: req.body.email})
    .exec((err, user) => {
      if( err ) return next({ message: err.message })
      if( !user ) {
        User.findOne({ _id: req.user._id }).exec((err, user) => { 
          if( err ) next(err);
          if( req.body.isAdmin && !user.isAdmin ) return next({ status: 403, message: 'Permisiune restrictionata.' })
          else 
            User.create(req.body, (err, doc) => {
              if( err ) {
                return next({ message: err.message })
              }
              return res.json(doc)
            })
         });
      } else return next({ status: 200, message: `Utilizatorul cu emailul ${req.body.email} exista deja in baza de date.`})
    })
})

// Update an existing user
router.put('/user/:id', (req, res, next) => {
  // const errors = validationResult(req)
  // if( req.body.email !== '' || req.body.password !== '' )
  //   if( !errors.isEmpty() ) return next({ errors: errors.array() })
  let paramID = req.params.id
  if( !req.body.email ) delete req.body.email // Prevent updating an empty email
  User.findOne({ _id: req.user._id })
    .exec((err, user) => {
      if( err ) {
        console.log('Error message: ', err.stack)
        return next({ message: err.message })
      }
      if( !user ) 
        return next({ status: 401, message: 'Token-ul de autentificare este invalid.' })
      else if( !user.isAdmin && req.body.isAdmin ) 
        return next({ status: 403, message: `Nu aveti permisiunea de a seta un utilizator ca fiind admin.` })
      else {
        User.findOne({_id: paramID}, (err, user) => {
          if( err ) return next({ message: err.message })
          if( !user ) 
            return next({ status: 200, message: `Utilizatorul cu id-ul ${paramID} nu exista in baza de date.` })
          else {
            User.findOneAndUpdate({_id: paramID}, req.body, { returnNewDocument: true })
              .exec((err, user) => {
                if( err ) {
                  if( err.codeName === 'DuplicateKey' )
                    return next({ status: 200, message: `Utilizatorul cu email-ul ${req.body.email} exista deja.` })
                  else
                    return next({ message: err.message })
                } else {
                  return res.json(user)
                }
              })
          }
        })
      }
    })
})

router.delete('/user/:id', (req, res, next) => {
  let paramID = req.params.id

  // Check TOKEN if is valid
  User.findOne({ _id: req.user._id })
    .exec((err, user) => {
      if( err ) return next({ message: err.message })
      if( !user ) 
        return next({ status: 401, message: 'Token-ul de autentificare este invalid.' })
      else if( !user.isAdmin ) {
        User.findOne({ _id: paramID })
          .exec((err, user) => {
            if( err ) return next({ status: err.status, message: err.message })
            if( !user ) 
              return next({ status: 200, message: `Utilizatorul cu id-ul ${paramID} nu exista.` })
            else if( user.isAdmin ) 
              return next({ status: 403, message: 'Nu aveti permisiunea de a sterge acest utilizator.' })
            else 
              User.findOneAndDelete({_id: paramID}).then(user => {
                return res.json({
                  user: user, 
                  message: `Utilizatorul cu id-ul ${paramID} a fost sters cu succes.`
                })
              }).catch(err => {
                next({ message: "Nu s-au putut procesa informatiile." })
              })
          })
      } else 
        User.findOneAndDelete({_id: paramID}).then(user => {
          return res.json({
            user: user, 
            message: `Utilizatorul cu id-ul ${paramID} a fost sters cu succes.`
          })
        }).catch(err => {
          next({ message: "Nu s-au putut procesa informatiile." })
        })
    })
  
})

module.exports = router















  // Truncate string (delete special characters) //
  // let reg = /[^a-zA-Z0-9]/g,
  //     paramID = req.params.id, // Typeof = String (\d, \w)
  //     match = paramID.match(reg),
  //     rm = 0

  // // Remove all non-character and non-digit
  // if( match ) 
  //   rm = match.map(e => {
  //     let index = paramID.indexOf(e)
  //     paramID = paramID.split('')
  //     paramID.splice(index, 1)
  //     paramID = paramID.join('')
  //   })
