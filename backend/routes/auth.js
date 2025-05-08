const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User,BlacklistedToken } = require("../models"); // Adjust path as needed
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// --- Input Validation Middleware (Basic Example) ---
const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  // Add more validation as needed (e.g., email format, password complexity)
  next();
};

// --- Registration Endpoint --- 
// POST /api/auth/register
router.post("/register", validateInput, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
     // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
      });
    }
    // Create new user (password hashing handled by model hook)
    const newUser = await User.create({ email, password });

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });

  } catch (error) {
    console.error("Registration error:", error);
    // Check for validation errors from Sequelize model
    if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: "Validation failed", errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
});

// --- Login Endpoint --- 
// POST /api/auth/login
router.post("/login", validateInput, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});


// Protected Route Example (Optional, as per requirements)
router.get("/me", authenticateToken, (req, res) => {
  // req.user is available here thanks to the middleware
  res.json({ userId: req.user.userId, email: req.user.email });
});


/**
 * Logout endpoint that invalidates the current token
 * POST /api/auth/logout
 */
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Add the token to a blacklist in the database
    // First decode the token (without verification) to get expiry
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    // Store the token in blacklist with its expiry time
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000) // Convert Unix timestamp to Date object
    });

    // Respond with success message
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
});

module.exports = router;




