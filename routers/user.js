const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const User = require("../models/user");
const { uploadSingleImage } = require("../middelware/uploadimageMiddelware");

router.get("/getUser/:id", (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to get the user." });
    });
});

router.get("/getAllUsers", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to get the users." });
    });
});

router.post("/addImage", uploadSingleImage("imageUrl"), async (req, res) => {
  const userId = req.query.userId;

  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Update the image in the database
    User.findByIdAndUpdate(userId, { imageUrl: filename }, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }
        res.send("Image updated successfully");
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to update the image." });
      });
  } else {
    res.status(400).json({ error: "No image provided." });
  }
});

module.exports = router;
