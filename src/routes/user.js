const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const cache = require('memory-cache')


const { check, validationResult } = require('express-validator/check');

// Get limited users
router.get('/user', (req, res, next) => {
  if( req.query.limit ) {
    User.find({}, { password: 0 })
      .limit( parseInt(req.query.limit) )
      .exec((err, users) => {
        if( err ) return next( err )
        if( !users ) 
          return res.status(200).json({ message: 'Nu exista utilizatori' })
        else
          return res.json({ users })
      })
  } else {
    //console.log("USER: ", req.user)
    return next({ status: 404, message: 'Nu exista informatii suficiente pentru aceasta cerere' })
  }
})

// Get user by id 
router.get('/user/:id', (req, res, next) => {
  /**
   * Personal:
   * ID-ul specific utilizatorului are o lungime de 24 de caractere;
   * Daca se mai adauga un caracter sau se sterge, se raspunde cu 
   * numele erorii "CastError". Pentru a evita aceasta eroare se 
   * verifica ca id-ul sa aiba lungimea specifica de 24 de caractere.
   */
  if( req.params.id.length !== req.user._id.length ) 
    return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  User.findOne({ _id: req.params.id })
    .exec((err, user) => {
      if( err ) return next( err )
      if( !user ) 
        return next({ status: 200, message: `Utilizatorul cu id-ul ${req.params.id} nu exista in baza de date` })
      else 
        return res.json(user)
    })
})

// Get user by email
router.get('/userByEmail/:email', (req, res, next) => {
  User.findOne({email: req.params.email})
    .exec((err, user) => {
      if( err ) return next( err )
      if( !user ) 
        return next({ status: 200, error: `Utilizatorul cu email-ul ${req.params.email} nu exista in baza de date` })
      else 
        return res.json(user)
    })
})

// Post new user 
router.post('/user', (req, res, next) => {
  // const errors = validationResult(req);
  // if ( !errors.isEmpty() ) return res.status(422).json({ errors: errors.array() });
  // if( req.body.isAdmin ) return res.json({error: `Nu aveti permisiunea de a adauga un admin.`})
  User.findOne({email: req.body.email})
    .exec(async (err, user) => {
      if( err ) return next( err )
      if( user ) 
        return next({ status: 200, message: `Utilizatorul cu emailul ${req.body.email} exista deja in baza de date` })
      else {
        if( req.body.isAdmin && !req.user.isAdmin ) 
          return next({ status: 403, message: 'Permisiune restrictionata' })
        else 
          await User.create(req.body, (err, doc) => {
            if( err ) 
              return next( err )
            if( !doc ) return next({ message: 'Nu s-au putut procesa informatiile' })
            return res.json(doc)
          })
      }
    })
})

// Update an existing user
router.put('/user/:id', (req, res, next) => {
  if( req.params.id.length !== req.user._id.length ) 
    return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  // const errors = validationResult(req)
  // if( req.body.email !== '' || req.body.password !== '' )
  //   if( !errors.isEmpty() ) return next({ errors: errors.array() })

  if( req.body.isAdmin && !req.user.isAdmin )
    return next({ status: 403, message: `Persmisiune restrictionata` })
  else {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if( err ) return next( err )
      if( !user ) 
        return next({ status: 200, message: `Utilizatorul cu id-ul ${req.params.id} nu exista in baza de date` })
      else {
        /**
         * Daca utilizatorul cu id-ul primit ca parametru este admin
         * atunci raspunde cu un mesaj de eroare si codul 403
         */
        if( user.isAdmin ) return next({ status: 403, message: 'Permisiune restrictionata' })
        /**
         * Daca utilizatorul introduce o noua parola, parola salvata 
         * nu va fi cryptata. 
         */
        if( req.body.password ) req.body.password = bcrypt.hashSync(req.body.password, 10)
        User.findOneAndUpdate({ _id: req.params.id}, req.body, { returnNewDocument: true })
          .exec((err, user) => {
            if( err ) {
              /**
               * Verifica daca mai exista un utilizator cu acelasi email;
               * Pentru a evita inca o data cautarea in baza de date a 
               * email-ului introdus de catre utilizator, se verifica 
               * numele codului de eroare { codeName: 'DuplicateKey' }
               */
              if( err.codeName === 'DuplicateKey' )
                return next({ status: 200, message: `Utilizatorul cu email-ul ${req.body.email} exista deja` })
              else return next( err )
            } else {
              if( !user ) 
                return next({ message: `Nu s-a putut face update utilizatorului cu id-ul ${req.params.id}` })
              return res.json(user)
            }
          })
        }
    })
  }
})

router.delete('/user/:id', (req, res, next) => {
  if( req.params.id.length !== req.user._id.length ) 
    return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  User.findOne({ _id: req.params.id })
    .exec((err, user) => {
      if( err ) return next( err )
      if( !user )
        return next({ status: 200, message: `Utilizatorul cu id-ul ${req.params.id} nu exista.` })
      else {
        /**
         * -----------------
         * Request User: A;
         * Post User: B;
         * -----------------
         * Daca A Nu este admin si B este admin, atunci se raspunde cu un mesaj specific erorii codului 403
         * Daca A este admin si B este de asemenea admin, atunci se va verifica daca ID-urile celor 2 utilizatori
         * corespund; daca nu, se va raspunde cu un mesaj specific erorii codului 403
         */
        // console.log("\n", user._id, "!==", req.user._id, "=>", user._id !== req.user._id)
        // console.log("req:", typeof user._id, "user:", typeof user._id)
        if( !req.user.isAdmin && user.isAdmin || user.isAdmin && user._id != req.user._id ) 
          return next({ status: 403, message: 'Permisiune restrictionata' })
        else
          User.findOneAndDelete({ _id: req.params.id }).then(user => {
            // Sterge token-ul din memoria cache
            cache.del(user._id)
            return res.json({
              user: user, 
              message: `Utilizatorul cu id-ul ${req.params.id} a fost sters cu succes.`
            })
          }).catch(err => {
            next( err )
          })
      }
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
