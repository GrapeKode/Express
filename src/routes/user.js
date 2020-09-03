const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const cache = require("memory-cache")
const config = require("../config")
const mongoose = require("mongoose")
mongoose.connect(config.mongoURI + "/user", { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
const conn = mongoose.connection
const Grid = require("gridfs-stream")
let gfs

conn.on("error", (err) => {
  console.log("MongoDB collection IMAGE error:", err)
})
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection("images")
})

router.get("/user", (req, res, next) => {
  if (req.query.limit) {
    User.find({}, { password: 0 })
      .limit(parseInt(req.query.limit))
      .exec((err, users) => {
        if (err) return next(err)
        if (!users) return res.status(200).json({ message: "Nu exista utilizatori" })
        else return res.json({ ...users })
      })
  } else if (req.params.limit === 0) {
    User.find({}, { password: 0 }).exec((err, users) => {
      if (err) return next(err)
      if (!users) return res.status(200).json({ message: "Nu exista utilizatori" })
      else return res.json({ ...users })
    })
  } else {
    return next({ status: 404, message: "Nu exista informatii suficiente pentru aceasta cerere" })
  }
})

router.get("/user/:id", (req, res, next) => {
  if (req.params.id.length !== req.user._id.length) return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  User.findOne({ _id: req.params.id }, { password: 0 }).exec((err, user) => {
    if (err) return next(err)
    if (!user) return next({ status: 200, message: `Utilizatorul cu id-ul ${req.params.id} nu exista in baza de date` })
    else return res.json(user)
  })
})

router.get("/userByEmail/:email", (req, res, next) => {
  User.findOne({ email: req.params.email }).exec((err, user) => {
    if (err) return next(err)
    if (!user) return next({ status: 200, error: `Utilizatorul cu email-ul ${req.params.email} nu exista in baza de date` })
    else return res.json(user)
  })
})

router.post("/user", (req, res, next) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (err) return next(err)
    if (user) return next({ status: 200, message: `Utilizatorul cu emailul ${req.body.email} exista deja in baza de date` })
    else {
      if (req.body.isAdmin && !req.user.isAdmin) return next({ status: 403, message: "Permisiune restrictionata" })
      if (!req.body.imageID) {
        await gfs.files.find({}).toArray(async (err, files) => {
          if (err) return console.log(err.stack)
          req.body.imageID = files[0]._id
          req.body.firstName = !req.body.firstName ? "New" : req.body.firstName
          req.body.lastName = !req.body.lastName ? "User" : req.body.lastName
          await User.create(req.body, (err, doc) => {
            if (err) return next(err)
            if (!doc) return next({ message: "Nu s-au putut procesa informatiile" })
            return res.json(doc)
          })
        })
      } else {
        await User.create(req.body, (err, doc) => {
          if (err) return next(err)
          if (!doc) return next({ message: "Nu s-au putut procesa informatiile" })
          return res.json(doc)
        })
      }
    }
  })
})

router.put("/user/:id", (req, res, next) => {
  if (req.params.id.length !== req.user._id.length) return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  if (req.body.isAdmin && !req.user.isAdmin) return next({ status: 403, message: `Persmisiune restrictionata` })
  else {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) return next(err)
      if (!user) return next({ status: 404, message: `Utilizatorul cu id-ul ${req.params.id} nu exista in baza de date` })
      else {
        if (user.isAdmin && req.user._id != user._id) return next({ status: 403, message: "Permisiune restrictionata" })
        if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 10)
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { returnNewDocument: true }).exec((err, user) => {
          if (err) {
            if (err.codeName === "DuplicateKey") return next({ status: 404, message: `Utilizatorul cu email-ul ${req.body.email} exista deja` })
            else return next(err)
          } else {
            if (!user) return next({ message: `Nu s-a putut face update utilizatorului cu id-ul ${req.params.id}` })
            console.log(user)
            return res.json(user)
          }
        })
      }
    })
  }
})

router.delete("/user/:id", (req, res, next) => {
  if (req.params.id.length !== req.user._id.length) return next({ status: 404, message: `Id-ul ${req.params.id} este incorect` })

  User.findOne({ _id: req.params.id }).exec((err, user) => {
    if (err) return next(err)
    if (!user) return next({ status: 200, message: `Utilizatorul cu id-ul ${req.params.id} nu exista.` })
    else {
      if ((!req.user.isAdmin && user.isAdmin) || (user.isAdmin && user._id != req.user._id)) return next({ status: 403, message: "Permisiune restrictionata" })
      else
        User.findOneAndDelete({ _id: req.params.id })
          .then((user) => {
            cache.del(user._id)
            return res.json({
              user: user,
              message: `Utilizatorul cu id-ul ${req.params.id} a fost sters cu succes.`,
            })
          })
          .catch((err) => {
            next(err)
          })
    }
  })
})

module.exports = router
