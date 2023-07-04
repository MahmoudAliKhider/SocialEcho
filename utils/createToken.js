const jwt = require("jsonwebtoken");

const createToken = (payload, role) =>
  jwt.sign({ userId: payload, role: role }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });

module.exports = createToken;
