const express = require("express");
const path = require("path");

const app = express();

const DatabaseConnection = require("./config/database");
require("dotenv").config();

DatabaseConnection();

app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/account", require("./routers/authUser"));
app.use("/api/user", require("./routers/user"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
