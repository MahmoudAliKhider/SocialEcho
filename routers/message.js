const router = require("express").Router();
const Message = require("../models/message");
const Notification = require("../models/notification");
const { getSocket } = require("../utils/socket/socket.io");

router.post("/:recipientId", async (req, res) => {
  const senderId = req.user.userId;
  const recipientId = req.params.recipientId;
  const content = req.body.content;

  try {
    const newMessage = new Message({ senderId, recipientId, content });
    await newMessage.save();

    const io = getSocket();
    io.to(recipientId).emit("new_message", { senderId, content });

    // Create a notification for the recipient
    const newNotification = new Notification({
      type: "message",
      userId: recipientId,
      message: "You have received a new message.",
    });
    await newNotification.save();

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending the message." });
  }
});

router.get("/thread/:recipientId", async (req, res) => {
  const loggedInUserId = req.user.userId;
  const recipientId = req.params.recipientId;

  try {
    const threadMessages = await Message.find({
      $or: [
        { senderId: loggedInUserId, recipientId },
        { senderId: recipientId, recipientId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(threadMessages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching thread messages." });
  }
});

router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting message", error });
  }
});
module.exports = router;
