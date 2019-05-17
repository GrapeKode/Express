const express = require('express')
const router = express.Router()

router.get('/current-user', (req, res, next) => {
  res.json({
    message: 'Secure API',
    user: req.user,
    token: req.query.secrete_token
  })
})

module.exports = router