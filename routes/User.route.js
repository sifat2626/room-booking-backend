// user.routes.js

const express = require("express");
const {
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    resetPassword
} = require("../controllers/User.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware"); // Ensure you have this middleware

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// Get user details route (protected)
router.get("/me", authenticateJWT, getUserDetails);

// Update user details route (protected)
router.put("/me", authenticateJWT, updateUserDetails);

module.exports = router;