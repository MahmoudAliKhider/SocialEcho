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

// notification as read
router.put("/:notificationId", async (req, res) => {
  const { notificationId } = req.params;
  const loggedInUserId = req.user.userId;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: loggedInUserId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ data: notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read.", error });
    console.log(error);
  }
});

module.exports = router;
