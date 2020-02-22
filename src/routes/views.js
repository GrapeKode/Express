const express = require('express')
const router = express.Router()
const cache = require('memory-cache')

function defaultObj(req) {
  let url = req.url.split('/')
  console.log(url[url.length - 1])
  return {
    title: url[url.length - 1]
  }
}

router.get('/home', (req, res) => {
  console.log(cache.exportJson());
  console.log('Req_header:', req.headers)
  res.render('home', defaultObj(req))
})

router.get('/login', (req, res) => {
  console.log(cache.exportJson());
  console.log('\nReq_Header:', req.headers)
  console.log('\nReq_User:', req.user)
  res.render('login', defaultObj(req))
})

module.exports = router