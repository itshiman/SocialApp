const express = require('express');

const userRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');

const authenticate = require('../authenticate');
const genPassword = require('../lib/passwordUtils').genPassword;

userRouter
  .route('/')

  .get(authenticate.verifyUser, async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
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

userRouter.route('/friends/:username').get(async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
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
