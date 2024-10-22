// booking.controller.js

const Booking = require("../models/Booking.model");
const Room = require("../models/Room.model");

// Create a new booking
const createBooking = async (req, res) => {
    const { roomId, bookedDates } = req.body;

    try {
        console.log('create booking');
        const roomExists = await Room.findById(roomId);
        if (!roomExists) {
            return res.status(404).json({ message: "Room not found." });
        }

        const existingBookings = await Booking.find({
            roomId,
            bookedDates: { $in: bookedDates },
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "Room is not available for the selected dates." });
        }

        const newBooking = new Booking({
            userId: req.user.id,
            roomId,
            bookedDates,
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a booking
const updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { roomId, bookedDates } = req.body;

    try {
        // Check if the booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Check if the room exists
        const roomExists = await Room.findById(roomId);
        if (!roomExists) {
            return res.status(404).json({ message: "Room not found." });
        }

        // Check for date conflicts with existing bookings
        const existingBookings = await Booking.find({
            roomId,
            _id: { $ne: bookingId }, // Exclude current booking from conflict check
            bookedDates: { $in: bookedDates },
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "Room is not available for the selected dates." });
        }

        // Update the booking
        booking.roomId = roomId;
        booking.bookedDates = bookedDates;

        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get booking history for a user
const getBookingHistory = async (req, res) => {
    try {
        console.log(`booking hitted`);
        const bookings = await Booking.find({ userId: req.user.id }).populate("roomId");

        if (!bookings.length) return res.status(404).json({ message: "No bookings found" });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });

        res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin route to get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("roomId userId"); // Populate as needed
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createBooking, updateBooking, getBookingHistory, cancelBooking, getAllBookings };