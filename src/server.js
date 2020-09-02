const express = require("express")
const path = require("path")
const port = process.env.port || 5000
const bodyParser = require("body-parser")
const passport = require("passport")
const config = require("./config")
const methodOverride = require("method-override")
const cors = require("cors")
// MongoDB
const mongoose = require("mongoose")
// Connect to mongoDB
console.log("_____ HERE ____", config.mongoURI)
mongoose.connect(config.mongoURI + "/user", { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
mongoose.Promise = global.Promise
const conn = mongoose.connection

conn.on("error", (err) => {
  return console.log("MongoDB connection error:", err.stack)
})

conn.once("open", async (err) => {
  if (err) return console.log(err.stack)
  console.log("MongoDB connected successfully")

  const app = express()

  // Models
  const UserModel = require("./models/user")

  // Router
  const routes = require("./routes/routes")
  const user = require("./routes/user")
  const secureRoute = require("./routes/secure-routes")
  const image = require("./routes/image")
  // Views
  const home = require("./routes/views")

  // Allows cross-origin domains to access this API
  app.use(cors())
  // app.use((req, res, next) => {
  //   res.append('Access-Control-Allow-Origin', '*')
  //   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  //   res.append('Access-Control-Allow-Headers', 'Origin, Accept, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
  //   res.append('Access-Control-Allow-Credentials', true)
  //   next()
  // })

  // Body parser
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }))
  app.use(methodOverride("_method"))
  app.use("/views", home)

  require("./auth/auth")

  // View Engine Pug = HTML framework
  app.set("views", path.join(__dirname, "views"))
  app.set("view engine", "pug")

  // Static
  app.use("/static", express.static("public"))

  // Routers
  app.use("/auth", routes) // Register & login
  app.use("/", image)
  app.use("/api", passport.authenticate("jwt", { session: false }), user)
  app.use("/", passport.authenticate("jwt", { session: false }), secureRoute)

  // Error handler middleware
  app.use((err, req, res, next) => {
    console.log("-----------------------------------------------------------------")
    console.log("__Middleware ERROR__ \n", err)
    console.log("-----------------------------------------------------------------")

    res.status(err.status || 500).json({ error: err })
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

// process.on('SIGTERM', () => {
//   console.info('SIGTERM signal received!')
//   console.log('Http server closing...')
//   server.close(() => {
//     console.log("Http server closed!")
//     mongoose.connection.close(false, () => {
//       console.log("MongoDB connection closed!")
//       process.exit(0)
//     })
//   })
// })
