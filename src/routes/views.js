const express = require('express')
const router = express.Router()
const cache = require('memory-cache')

router.get('/home', (req, res) => {
  console.log(cache.exportJson());
  console.log('Req_header:', req.headers)
  res.render('home', {})
})

router.get('/login', (req, res) => {
  console.log(cache.exportJson());
  console.log('\nReq_Header:', req.headers)
  console.log('\nReq_User:', req.user)
  res.render('login', {})
})

module.exports = router