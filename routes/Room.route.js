// room.routes.js

const express = require("express");
const {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    checkAvailability
} = require("../controllers/Room.controller");
const { authenticateJWT, authorizeRole } = require("../middlewares/auth.middleware"); // Ensure you have this middleware

const router = express.Router();

// Create a new room (protected route, admin only)
router.post("/", authenticateJWT, authorizeRole(['admin']), createRoom);

// Get all rooms
router.get("/", getAllRooms); // Public route

// Get room by ID
router.get("/:id", getRoomById); // Public route

// Update a room (protected route, admin only)
router.put("/:id", authenticateJWT, authorizeRole(['admin']), updateRoom);

// Delete a room (protected route, admin only)
router.delete("/:id", authenticateJWT, authorizeRole(['admin']), deleteRoom);

// Check availability of a room (public route)
router.post("/check-availability", checkAvailability);

module.exports = router;