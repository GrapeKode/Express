const express = require('express')
const router = express.Router()

router.get('/current-user', (req, res, next) => {
  // console.log(`REQUEST: \n${JSON.stringify(req.headers)}`)
  res.json({
    message: 'Secure API',
    user: req.user,
    token: req.headers['x-auth']
  })
})

module.exports = router