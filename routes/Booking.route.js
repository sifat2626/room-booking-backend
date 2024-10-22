// booking.routes.js

const express = require("express");
const {
    createBooking,
    updateBooking,
    getBookingHistory,
    cancelBooking,
} = require("../controllers/Booking.controller");
const { authenticateJWT, authorizeRole } = require("../middlewares/Auth.middleware");
const Booking = require("../models/Booking.model"); // Ensure you have this middleware

const router = express.Router();

// Create a new booking (protected route)
router.post("/", authenticateJWT,authorizeRole(['admin']), createBooking);

// Update a booking (protected route)
router.put("/:bookingId", authenticateJWT,authorizeRole(['admin']), updateBooking); // New route for updating bookings

// Get booking history for a user (protected route)
router.get("/history", authenticateJWT, getBookingHistory);

// Cancel a booking (protected route)
router.delete("/:bookingId", authenticateJWT,authorizeRole(['admin']), cancelBooking);

// Admin route to get all bookings (protected route, admin only)
router.get("/", authenticateJWT, authorizeRole(['admin']), async (req, res) => {
    try {
        const bookings = await Booking.find().populate("roomId userId"); // Populate as needed
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;