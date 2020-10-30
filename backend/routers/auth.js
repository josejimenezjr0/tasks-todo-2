const express = require('express')
const router = new express.Router()
const passport = require('passport');
const { DOMAIN, CLIENT_ID, CLIENT_SECRET } = process.env

router.get('/api/login', passport.authenticate('auth0', { scope: 'openid email profile'}), (req, res) => {
  res.redirect('/')
})


router.get('/api/login/callback', (req, res, next) => { 
  passport.authenticate('auth0', function (err, user, info) {
    if (err) return next(err)
    if (!user) return res.redirect(`https://${DOMAIN}/v2/logout?client_id=${CLIENT_ID}&returnTo=http%3A%2F%2Flocalhost%3A3000%2F`)
    req.logIn(user, function (err) {
      if (err) return next(err)
      console.log('After login had session:', req.session.user);
      delete req.session.user
      console.log('After session delete:', req.session.user);
      res.redirect('/')
    })
  })(req, res, next)
})

router.get('/api/logout', (req, res) => {
  console.log('/api/logout')
  req.logout();
  res.redirect(`https://${DOMAIN}/v2/logout?client_id=${CLIENT_ID}&returnTo=http%3A%2F%2Flocalhost%3A3000%2F`)
})

router.get('/api/current_user', (req, res) => {
  console.log('current_user');
  console.log('req.user: ', req.user);
  res.send(req.user);
})

module.exports = router