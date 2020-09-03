const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const config = require("../config")
const cache = require("memory-cache")
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
const UserModel = require("../models/user")
const router = express.Router()

router.post("/signup", async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    try {
      if (err || !user) {
        return next({ status: info.status, message: info.message })
      }
      await gfs.files.find({}).toArray(async (err, files) => {
        if (err) return done(err)
        for (let file of files) {
          if (file.metadata === "default") {
            const doc = await UserModel.create({
              email: user.email,
              password: user.password,
              imageID: file._id,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
            })
            return res.json({
              user: doc,
              message: "Signup successful",
            })
          }
        }
      })
    } catch (err) {
      return next(err)
    }
  })(req, res, next)
})

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return next({ status: info.status, message: info.message })
      }
      req.login(user, { session: false }, (error) => {
        if (error) return next(error)
        const body = { _id: user._id, email: user.email, isAdmin: user.isAdmin }
        const token = jwt.sign({ user: body }, config.secret)
        cache.put(user._id, token, 43200000)
        return res.json({
          token,
          info,
        })
      })
    } catch (err) {
      return next(err)
    }
  })(req, res, next)
})

router.get("/logout", async (req, res, next) => {
  passport.authenticate("jwt", async (err, user, info) => {
    try {
      if (err || !user) return res.sendStatus(401)
      let token = await jwt.decode(req.header("x-auth"))
      cache.del(token.user._id)
      return res.json({ user: token.user, message: "Logged out" })
    } catch (err) {
      next(err)
    }
  })(req, res, next)
})

module.exports = router
