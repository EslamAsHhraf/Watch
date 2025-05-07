const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";
const { BlacklistedToken } = require("../models");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // if there isn't any token
  }

  const isBlacklisted = await BlacklistedToken.isBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is no longer valid" });
    }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if ( err )
    {
      console.info(err);
      console.error("JWT Verification Error:", err.message);
      return res.sendStatus(403); // Invalid token
    }
    req.user = user; // Add decoded user payload to request object
    next();
  });
};

module.exports = authenticateToken;

