const router = require("express").Router();
const Notification = require("../models/notification");

router.get("/", async (req, res) => {
  const loggedInUserId = req.user.userId;

  try {
    const notifications = await Notification.find({ userId: loggedInUserId });

    res.status(200).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notifications.", error });
    console.log(error);
  }
});
module.exports = router;
