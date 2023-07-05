const mongoose = require("mongoose");

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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  
});

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
