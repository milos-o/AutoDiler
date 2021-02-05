const express = require("express");
require('./passport/google-auth');

const router = express.Router();

//Unprotected Routes
app.get('/', (req, res) => {
    res.send('<h1>Home</h1>')
  });
  
  app.get('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
  });
  
  // Middleware - Check user is Logged in
  const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401);
  }
  
  //Protected Route.
  app.get('/profile', checkUserLoggedIn, (req, res) => {
    res.send(`<h1>${req.user.displayName}'s Profile Page</h1>`)
  });
  
  // Auth Routes
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
      res.redirect('/profile');
    }
  );
  
  //Logout
  app.get('/logout', (req, res) => {
      req.session = null;
      req.logout();
      res.redirect('/');
  })
  
  
module.exports = router;