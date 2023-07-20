const express = require("express");
const path = require("path");

const app = express();

const DatabaseConnection = require("./config/database");
const authMiddleware = require("./middelware/authMiddelware");
const { initSocket } = require('./utils/socket/socket.io'); // Import the initSocket function

require("dotenv").config();

const http = require('http');
const io = initSocket(http);

io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('join', (recipientId) => {
    socket.join(recipientId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

DatabaseConnection();
app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/account", require("./routers/authUser"));
app.use(authMiddleware);

app.use("/api/user", require("./routers/user"));
app.use("/api/post", require("./routers/post"));
app.use("/api/message", require("./routers/message"));
app.use("/api/myNetwork", require("./routers/myNetwork"));
app.use("/api/notifications", require("./routers/notification"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
