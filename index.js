const express = require("express");
// const bodyParser = require('body-parser');

const app = express();

const DatabaseConnection = require('./config/database');
require("dotenv").config();

app.use(express.json());
DatabaseConnection();

app.use('/api/user',require('./routers/authUser'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
