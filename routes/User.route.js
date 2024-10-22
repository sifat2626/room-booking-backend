const express = require("express");
const {
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    logoutUser,
} = require("../controllers/User.controller");
const { authenticateJWT } = require("../middlewares/Auth.middleware");

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// Get user details route (protected)
router.get("/me", authenticateJWT, getUserDetails);

// Update user details route (protected)
router.put("/me", authenticateJWT, updateUserDetails);

// User logout route (protected)
router.post("/logout", authenticateJWT, logoutUser);

module.exports = router;