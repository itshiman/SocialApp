const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    userId: {
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
    userId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
