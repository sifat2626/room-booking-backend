// Room.controller.js

const Room = require("../models/Room.model");
const Booking = require("../models/Booking.model");

const multer = require('multer');
const {storage} = require("../config/cloudinary");
const upload = multer({ storage });

// Create a new room with photo upload
const createRoom = async (req, res) => {
    const { title, rent, facilities } = req.body;

    try {
        const picture = req.file ? req.file.path : null; // Get the Cloudinary URL for the uploaded picture
        const newRoom = new Room({ title, rent, facilities, picture });

        await newRoom.save();
        res.status(201).json({
            message: 'Room created successfully',
            room: newRoom,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findById(id);
        if (!room) return res.status(404).json({ message: "Room not found" });

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a room
const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { title, rent, facilities } = req.body;

    try {
        const picture = req.file ? req.file.path : null; // Optional photo update
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { title, rent, facilities, ...(picture && { picture }) },
            { new: true }
        );

        if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });

        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a room
const deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) return res.status(404).json({ message: "Room not found" });

        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check availability of a room
const checkAvailability = async (req, res) => {
    const { roomId, bookedDates } = req.body;

    // Validate that roomId is provided
    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required." });
    }

    // Validate that bookedDates are provided
    if (!bookedDates || bookedDates.length === 0) {
        return res.status(400).json({ message: "Booked dates are required." });
    }

    try {
        // Check if the room exists
        const roomExists = await Room.findById(roomId);
        if (!roomExists) {
            return res.status(404).json({ message: "Room not found." });
        }

        // Check for date conflicts
        const existingBookings = await Booking.find({
            roomId,
            bookedDates: { $in: bookedDates },
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "Room is not available for the selected dates." });
        }

        res.status(200).json({ message: "Room is available." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, checkAvailability,upload };