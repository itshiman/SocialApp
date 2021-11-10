const express = require('express');

const postRouter = express.Router();
const mongoose = require('mongoose');

const Posts = require('../models/posts');
const User = require('../models/users');
const authenticate = require('../authenticate');
const followedLanguages = require('../lib/followedLanguage').followedLanguages;

postRouter
  .route('/')
  //Post
  .post(authenticate.verifyUser, (req, res, next) => {
    const newPost = { ...req.body, userId: req.user._id };
    Posts.create(newPost)
      .then(
        (post) => {
          console.log('Post Created ', post);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(post);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  //Forbidden route
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts');
  });

postRouter
  .route('/:id')
  //Getting a post
  .get((req, res, next) => {
    Posts.findById(req.params.id)
      .then(
        (post) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(post);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  //Forbidden route
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/' + req.params.postId);
  })

  //Editing a post
  .put(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.id)
      .then(
        (post) => {
          if (post.userId == req.user._id) {
            post.updateOne({ $set: req.body }).then(() => {
              res.status(200).json('Post has been Updated');
            });
          } else {
            res.status(403).json('you can update only your post');
          }
        },
        (err) => next(err)
      )
      .catch((err) => err);
  })

  //Deleting a post
  .delete(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.id)
      .then(
        (post) => {
          if (post.userId == req.user._id) {
            post.deleteOne().then(() => {
              res.status(200).json('Post has been deleted');
            });
          } else {
            res.status(403).json('you can delete only your post');
          }
        },
        (err) => next(err)
      )
      .catch((err) => err);
  });

postRouter
  .route('/:id/like')

  //Like/Unlike a post
  .put((req, res, next) => {
    Posts.findById(req.params.id)
      .then(
        (post) => {
          if (!post.likes.includes(req.body.userId)) {
            post.updateOne({ $push: { likes: req.body.userId } }).then(
              () => {
                res.status(200).json('You have liked the post');
              },
              (err) => next(err)
            );
          } else {
            post.updateOne({ $pull: { likes: req.body.userId } }).then(
              () => {
                res.status(200).json('You have unliked the post');
              },
              (err) => next(err)
            );
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });

postRouter
  .route('/:postId/comments')

  //Getting comments on a post
  .get((req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments);
          } else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  //Posting a comment on post
  .post(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            post.comments.push(req.body);
            post.save().then(
              (post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
              },
              (err) => {
                console.log(err);
                next(err);
              }
            );
          } else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => {
          console.log(err);
          next(err);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  })

  //Forbidden route
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'PUT operation not supported on /postes/' +
        req.params.postId +
        '/comments'
    );
  });

postRouter
  .route('/:postId/comments/:commentId')
  //Getting a comment
  .get((req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments.id(req.params.commentId));
          } else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
          } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  //Forbidden route
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'POST operation not supported on /postes/' +
        req.params.postId +
        '/comments/' +
        req.params.commentId
    );
  })
  //Editing a comment
  .put(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        (post) => {
          const comment = post.comments.id(req.params.commentId);
          if (comment.userId == req.user._id) {
            if (post != null && comment != null) {
              if (req.body.rating) {
                post.comments.id(req.params.commentId).rating = req.body.rating;
              }
              if (req.body.comment) {
                post.comments.id(req.params.commentId).comment =
                  req.body.comment;
              }
              post.save().then(
                (post) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(post);
                },
                (err) => next(err)
              );
            } else if (post == null) {
              err = new Error('Post ' + req.params.postId + ' not found');
              err.status = 404;
              return next(err);
            } else {
              err = new Error('Comment ' + req.params.commentId + ' not found');
              err.status = 404;
              return next(err);
            }
          } else {
            res.status(403).json('You can edit only your comment');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  //Deleting a comment
  .delete(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        (post) => {
          const comment = post.comments.id(req.params.commentId);
          if (comment.userId == req.user._id) {
            if (post != null && comment != null) {
              post.comments.id(req.params.commentId).remove();
              post.save().then(
                (post) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(post);
                },
                (err) => next(err)
              );
            } else if (post == null) {
              err = new Error('Post ' + req.params.postId + ' not found');
              err.status = 404;
              return next(err);
            } else {
              err = new Error('Comment ' + req.params.commentId + ' not found');
              err.status = 404;
              return next(err);
            }
          } else {
            res.status(403).json('You can only delete your comment');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//Get timeline posts
postRouter.route('/timeline/:id').get(async (req, res, next) => {
  const currentUser = await User.findById(req.params.id);
  try {
    const userPosts = await Posts.find({ userId: currentUser._id });
    var friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Posts.find({ userId: friendId });
      })
    );

    const catPosts = await Promise.all(
      currentUser.categories.map((name) => {
        return Posts.find({ category: name });
      })
    );

    var tempResPosts = [...userPosts];

    if (catPosts[0]) {
      catPosts[0].forEach(function (item) {
        var flag = 0;
        for (var i = 0; i < userPosts.length; i++) {
          if (item.userId === userPosts[i].userId) {
            flag = 1;
          }
        }
        if (flag == 0) {
          tempResPosts.push(item);
        }
      });
    }

    var resPosts = [...tempResPosts];

    if (friendPosts[0]) {
      friendPosts[0].forEach(function (item) {
        var flag = 0;
        for (var i = 0; i < tempResPosts.length; i++) {
          if (item.userId === tempResPosts[i].userId) {
            flag = 1;
          }
        }
        if (flag == 0) {
          resPosts.push(item);
        }
      });
    }

    res.status(200);
    res.json(resPosts);
  } catch (error) {
    console.log(error);
  }
});

//Get user all post

postRouter.route('/profile/:username').get(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  try {
    const user = await User.findOne({ username: req.params.username });
    const userPosts = await Posts.find({ userId: user._id });
    res.status(200);
    res.json(userPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get category all post

postRouter.route('/category/:username').get(async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const userPosts = await Posts.find({ category: user.username });
    res.status(200);
    res.json(userPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = postRouter;
