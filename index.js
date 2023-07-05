const express = require("express");
const path = require("path");

const app = express();

const DatabaseConnection = require("./config/database");
const authMiddleware = require("./middelware/authMiddelware");
require("dotenv").config();

DatabaseConnection();

app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/account", require("./routers/authUser"));
app.use(authMiddleware);

app.use("/api/user", require("./routers/user"));
app.use("/api/post", require("./routers/post"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
