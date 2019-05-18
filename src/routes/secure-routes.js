const express = require('express')
const router = express.Router()

router.get('/current-user', (req, res, next) => {
  res.json({
    message: 'Secure API',
    user: req.user,
    token: req.headers['x-auth']
  })
})

// Logout
router.get('/logout', async (req, res, next) => {
  let jti = jwt.decode(req.header('x-auth')).iat // 4
  // let cache_jwt = cache.get(jti)
  /**
   * Daca se face o cerere cu un token invalid, raspunde cu un mesaj de eroare.
   * 
   */
  cache.del(jti)
  res.json({ user: req.user, message: 'Logged out' })
})

module.exports = router