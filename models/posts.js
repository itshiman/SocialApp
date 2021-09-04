const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
