const express = require('express')
const router = express.Router()
const User = require('../models/user')

// Get limited users
router.get('/user', (req, res, next) => {
  if( req.query.limit ) {
    User.find( {} )
      .limit( parseInt(req.query.limit) )
      .exec((err, users) => {
        if( !err ) {
          res.send(users)
        }
      })
  }
})
// Get user by id 
router.get('/user/:id', (req, res, next) => {
  let paramID = req.params.id 

  User.findOne({_id: paramID})
    .exec((err, user) => {
      if( err ) return res.status(422).send({error: "Nu s-au putut procesa informatiile."})
      if( !user ) 
        res.send({error: `Utilizatorul cu id-ul ${paramID} nu exista in baza de date.`})
      else res.send(user)
    })
})
// Get user by email
router.get('/userByEmail/:email', (req, res, next) => {
  User.findOne({email: req.params.email})
    .exec((err, user) => {
      if( !err ) {
        if( !user ) 
          res.send({error: `Utilizatorul cu email-ul ${req.params.email} nu exista in baza de date.`})
        else res.send(user)
      }
    })
})
// Post new user JSON
router.post('/user', (req, res, next) => {
  if( req.body.isAdmin ) return res.send({error: `Nu aveti permisiunea de a adauga un admin.`})
  User.findOne({email: req.body.email})
    .exec((err, user) => {
      if( err ) return res.send({error: err.message})
      if( !user ) {
        User.create(req.body, (err, doc) => {
          if( err ) return res.send({error: err.message})
          return res.send(doc)
        })
      } else return res.send({error: `Utilizatorul cu emailul ${req.body.email} exista deja in baza de date.`})
    })
})
// Update an existing user
router.put('/user/:id', (req, res, next) => {
  let paramID = req.params.id
  if( !req.body.email ) delete req.body.email // Prevent updating an empty email
  
  User.findOne({email: req.body.email})
    .exec((err, user) => {
      if( err ) {
        console.log('Error message: ', err.message)
        return res.status(500).send({error: err.message})
      }
      if( user ) return res.send({error: `Utilizatorul cu email-ul ${req.body.email} exista deja.`})
      else {
        User.findOneAndUpdate({_id: paramID}, req.body)
          .then(() => {
            User.findOne({_id: paramID}, (err, user) => {
              if( err ) return res.send({error: err.message})
              if( !user ) return res.send({error: `Utilizatorul cu id-ul ${paramID} nu exista in baza de date.`})
              return res.send(user)
            })
          })
          .catch(err => {
            res.status(422).send({error: "Nu s-au putut procesa informatiile."})
            console.log("Error message: ", err.message)
          })
      }
    })
})

router.delete('/user/:id', (req, res, next) => {
  let paramID = req.params.id

  User.findOneAndDelete({_id: paramID}).then(doc => {
    if( !doc ) return res.send({error: `Utilizatorul cu id-ul ${paramID} nu exista.`})
    return res.send({
      user: doc, 
      message: `Utilizatorul cu id-ul ${paramID} a fost sters cu succes.`
    })
  }).catch(err => {
    res.status(422).send({error: "Nu s-au putut procesa informatiile."})
    console.log("Error message: ", err.message)
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
