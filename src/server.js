const express = require("express")
const path = require("path")
const port = process.env.port || 5000
const bodyParser = require("body-parser")
const passport = require("passport")
const config = require("./config")
const methodOverride = require("method-override")
const cors = require("cors")
const mongoose = require("mongoose")
mongoose.connect(config.mongoURI + "/user", { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
mongoose.Promise = global.Promise
const conn = mongoose.connection

conn.on("error", (err) => {
  return console.info("MongoDB connection error:", err.stack)
})

conn.once("open", async (err) => {
  if (err) return console.log(err.stack)
  console.info("MongoDB connected successfully")

  const app = express()
  const UserModel = require("./models/user")
  const routes = require("./routes/routes")
  const user = require("./routes/user")
  const secureRoute = require("./routes/secure-routes")
  const image = require("./routes/image")

  app.use(cors())
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }))
  app.use(methodOverride("_method"))

  require("./auth/auth")

  app.use("/static", express.static("public"))
  app.use("/auth", routes)
  app.use("/", image)
  app.use("/api", passport.authenticate("jwt", { session: false }), user)
  app.use("/", passport.authenticate("jwt", { session: false }), secureRoute)

  app.use((err, req, res, next) => {
    if (err) {
      res.status(err.status || 500).json({ error: err })
    }
  })

  const server = app.listen(port, () => console.info(`Server has started on port ${port}`))

  mongoose.connection.on("disconnected", () => {
    console.info("Mongose connection failed!")
    server.close(() => {
      console.log("Http server closed!")
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed!")
        process.exit(0)
      })
    })
  })
})
