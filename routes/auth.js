const express = require('express');
const router = express.Router();
const passport = require('passport');

const authenticate = require('../authenticate');
const User = require('../models/users');
const genPassword = require('../lib/passwordUtils').genPassword;

router.post('/signup', (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = {
    ...req.body,
    salt,
    hash,
  };
  User.create(newUser)
    .then(
      (user) => {
        console.log('New User Created ', user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ username: user.username, email: user.email });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'You are successfully logged in!',
  });
});

router.get('/logout', (req, res, next) => {
  console.log(req.session);
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
