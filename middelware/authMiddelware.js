const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const tokenWithoutBearer = token.split(" ")[1];
  
    try {
      // Verify the token
      const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);
  
      res.status(200).json({ message: "Authorized", user: decoded });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;
