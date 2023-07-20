const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  postImageUrl: {
    type: String,
    default: null,
  },
  isLikedByCurrentUser: {
    type: Boolean,
    default: false,
  },
  numberUsermakeLike: {
    type: Number,
    default: 0,
  },
  usersWhoLiked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  comments: [commentSchema],
});

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
