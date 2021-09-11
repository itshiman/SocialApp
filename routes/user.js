const express = require('express');

const userRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');

const authenticate = require('../authenticate');
const genPassword = require('../lib/passwordUtils').genPassword;

userRouter
  .route('/:id')
  .get(authenticate.verifyUser, (req, res) => {
    if (req.user.admin) {
      User.findById(req.params.id)
        .then((user) => {
          const { salt, hash, ...other } = user._doc;
          res.status(200);
          res.json(other);
        })
        .catch((err) => res.json(err));
    } else {
      return res.status(403).json('You are not an admin');
    }
  })
  .put(authenticate.verifyUser, (req, res) => {
    if (req.params.id == req.user._id || req.user.admin) {
      if (req.body.password) {
        const saltHash = genPassword(req.body.password);
        req.user.salt = saltHash.salt;
        req.user.hash = saltHash.hash;
      }
      User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      })
        .then(() => {
          res.status(200);
          res.json('Account has been updated');
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    } else {
      return res.status(403).json('You can update only your account');
    }
  })
  .delete(authenticate.verifyUser, (req, res) => {
    if (req.params.id == req.user._id || req.user.admin) {
      User.findByIdAndDelete(req.params.id).then(() => {
        res.status(200);
        res.json('Account has been Deleted');
      });
    } else {
      return res.status(403).json('You can delete only your account');
    }
  });

userRouter.route('/:id/follow').put(authenticate.verifyUser, (req, res) => {
  const currentUser = req.user._id;
  const targetUser = req.params.id;
  if (currentUser != targetUser) {
    User.findById(targetUser).then((target) => {
      if (target) {
        if (!target.followers.includes(currentUser)) {
          User.findOneAndUpdate(
            { _id: target },
            { $push: { followers: currentUser } }
          ).then(() => {
            User.findOneAndUpdate(
              { _id: currentUser },
              { $push: { followings: target._id } }
            ).then(() => {
              res.status(200).json('You are now following ' + target.username);
            });
          });
        } else {
          res.status(403).json('You already follow the user');
        }
      } else {
        res.status(404).json('User Not Found');
      }
    });
  } else {
    res.status(403).json("You can't follow yourself");
  }
});
userRouter.route('/:id/unfollow').put(authenticate.verifyUser, (req, res) => {
  const currentUser = req.user._id;
  const targetUser = req.params.id;
  if (currentUser != targetUser) {
    User.findById(targetUser).then((target) => {
      if (target) {
        if (target.followers.includes(currentUser)) {
          User.findOneAndUpdate(
            { _id: target },
            { $pull: { followers: currentUser } }
          ).then(() => {
            User.findOneAndUpdate(
              { _id: currentUser },
              { $pull: { followings: target._id } }
            ).then(() => {
              res.status(200).json('You have unfollowed ' + target.username);
            });
          });
        } else {
          res.status(403).json("You don't follow the user");
        }
      }
    });
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = userRouter;
