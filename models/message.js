const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  recipientId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Message', messageSchema);
