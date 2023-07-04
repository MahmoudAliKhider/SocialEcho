const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.SECRET_KEY, {
    expiresIn: "20h",
  });

module.exports = createToken;
