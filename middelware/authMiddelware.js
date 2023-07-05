const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);

    req.user = decoded; // Set the decoded user object in the request
    next(); // Call the next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
