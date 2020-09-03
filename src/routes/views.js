const express = require("express")
const router = express.Router()

function defaultObj(req) {
  let url = req.url.split("/")
  return {
    title: url[url.length - 1],
  }
}

router.get("/home", (req, res) => {
  res.render("home", defaultObj(req))
})

router.get("/login", (req, res) => {
  res.render("login", defaultObj(req))
})

module.exports = router
