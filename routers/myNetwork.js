const router = require("express").Router();

const MyNetwork = require("../models/my-network");
const User = require("../models/user");

router.post("/:destinationUserId", async (req, res) => {
  const { destinationUserId } = req.params;
  const loggedInUserId = req.user.userId;

  try {
    const destinationUser = await User.findById(destinationUserId);
    if (!destinationUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (destinationUserId === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const isAlreadyFollowing = await MyNetwork.findOne({
      user: loggedInUserId,
      followers: destinationUserId,
    });

    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already following this user." });
    }

    // Update the user's followers list
    const updatedMyNetwork = await MyNetwork.findOneAndUpdate(
      { user: loggedInUserId },
      { $push: { followers: destinationUserId } },
      { upsert: true }
    );

    // Update the destination user's followBy list
    const updatedDestinationNetwork = await MyNetwork.findOneAndUpdate(
      { user: destinationUserId },
      { $addToSet: { followBy: loggedInUserId } },
      { upsert: true }
    );

    const followers = await User.find(
      { _id: { $in: updatedMyNetwork.followers } },
      "userName imageUrl"
    );
    updatedMyNetwork.followers = followers;

    const followByUsers = await User.find(
      { _id: { $in: updatedDestinationNetwork.followBy } },
      "userName imageUrl"
    );
    updatedDestinationNetwork.followBy = followByUsers;

    res.status(200).json({
      message: "You are now following the user.",
      data: {
        myNetwork: updatedMyNetwork,
        destinationNetwork: updatedDestinationNetwork,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error following the user.", error });
    console.log(error);
  }
});

router.get("/current-user-followers", async (req, res) => {
  const loggedInUserId = req.user.userId;

  try {
    const currentUserNetwork = await MyNetwork.findOne({
      user: loggedInUserId,
    }).populate("followers", "userName imageUrl");
    if (!currentUserNetwork) {
      return res
        .status(404)
        .json({ message: "MyNetwork not found for the current user." });
    }

    res.status(200).json({ data: currentUserNetwork.followers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching current user's followers.", error });
    console.log(error);
  }
});

router.get("/current-user-followed-by", async (req, res) => {
  const loggedInUserId = req.user.userId; // Assuming you have authenticated the user and have access to their userId

  try {
    // Find the MyNetwork document for the current user
    const currentUserNetwork = await MyNetwork.findOne({
      user: loggedInUserId,
    }).populate("followBy", "userName imageUrl");
    if (!currentUserNetwork) {
      return res
        .status(404)
        .json({ message: "MyNetwork not found for the current user." });
    }

    res.status(200).json({ data: currentUserNetwork.followBy });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users who follow the current user.",
      error,
    });
    console.log(error);
  }
});

module.exports = router;
