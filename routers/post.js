const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const { uploadSingleImage } = require("../middelware/uploadimageMiddelware");
const Post = require("../models/post");
const User = require("../models/user");

router.post(
  "/createPosts",
  uploadSingleImage("postImageUrl"),
  async (req, res) => {
    const { content } = req.body;
    let postImageUrl;

    if (req.file) {
      const filename = `post-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/posts/${filename}`);

      postImageUrl = filename;
    }

    try {
      const newPost = await Post.create({
        content,
        postImageUrl,
        owner: req.user.userId,
      });

      // Retrieve the owner data
      const owner = await User.findById(req.user.userId).select(
        "userName imageUrl"
      );

      newPost.owner = owner;
      await newPost.save();

      res.status(201).json({ data: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post", error });
    }
  }
);

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("owner", "userName imageUrl");
    res.status(200).json({ data: posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Error retrieving posts", error });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate(
      "owner",
      "userName imageUrl"
    );
    console.log(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ data: post });
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Error retrieving post", error });
  }
});

router.delete("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postImageUrl) {
      const imagePath = path.join("uploads/posts", post.postImageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error });
  }
});

router.put(
  "/update/:postId",
  uploadSingleImage("postImageUrl"),
  async (req, res) => {
    const postId = req.params.postId;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Delete the previous image if it exists
      if (post.postImageUrl) {
        const imagePath = path.join("uploads/posts", post.postImageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      post.content = req.body.content;
  
      if (req.file) {
        const filename = `post-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/posts/${filename}`);
  
        post.postImageUrl = filename;
      }
  
      const updatedPost = await post.save();
  
      res.status(200).json({ data: updatedPost });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Error deleting post", error });
    }
  }
);
module.exports = router;
