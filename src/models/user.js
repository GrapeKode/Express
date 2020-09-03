const mongoose = require("mongoose")
const config = require("../config")
const db = mongoose.createConnection(config.mongoURI + "/user", { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true })
const conn = mongoose.connection
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const assert = require("assert")

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "is required"],
  },
  firstName: {
    type: String,
    default: "First Name",
  },
  lastName: {
    type: String,
    default: "Last Name",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  imageID: {
    type: String,
    default: null,
  },
})

// This is called a pre-hook, before the user information is saved in the database
// this function will be called, we'll get the plain text password, hash it and store it.
UserSchema.pre("save", async function (next) {
  const user = this
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

// We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function (password) {
  const user = this
  //Hashes the password sent by the user for login and checks if the hashed password stored in the
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password)
  return compare
}

const User = mongoose.model("user", UserSchema)

const user = new User({
  email: "ghetes.damaris.ligia@student.usv.ro",
  password: "Test123!",
  firstName: "Damaris-Ligia",
  lastName: "Ghetes",
  isAdmin: true,
})

let defaultImagePath = "./public/img/profile-img.jpg"

db.on("connected", async (err) => {
  if (err) return console.error(err)
  await User.countDocuments({ isAdmin: true }, async (err, count) => {
    if (err) return console.log(err.stack)
    if (!count) {
      await User.create(user, async (err, doc) => {
        if (err) return console.error(err)
      })
    }
    const conn = mongoose.connection
    const Grid = require("gridfs-stream")
    const gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection("images")
    await gfs.files.find({}).toArray(async (err, files) => {
      if (err) return console.log(err.stack)
      if (!files[0]) {
        await crypto.randomBytes(16, async (err, buf) => {
          if (err) console.log(err.stack)
          const source = fs.createReadStream(defaultImagePath)
          const fileName = buf.toString("hex") + path.extname("profile-img.jpg")
          const target = await gfs.createWriteStream({
            filename: fileName,
            content_type: "image/jpeg",
            metadata: "default",
            root: "images",
          })
          let file = source.pipe(target)
          await User.updateMany({}, { $set: { imageID: file.id } }, { multi: true }, (err, doc) => {
            if (err) return console.log(err.stack)
            if (!doc.ok) return console.log("Error updating user image\n", doc)
            console.log("IMAGE: __OK__\n", doc)
          })
        })
      } else {
        await User.updateMany({ imageID: null }, { $set: { imageID: files[0]._id } }, { multi: true }, (err, doc) => {
          if (err) return console.log(err.stack)
          if (!doc.ok) return console.log("Error updating user image")
        })
      }
    })
  })
})

module.exports = User
