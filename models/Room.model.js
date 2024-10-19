const mongoose = require("mongoose");

// Define the Room schema
const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    facilities: {
        type: [String],
        required: true,
    },
    picture: {
        type: String, // URL or path to the room image
    }
}, { timestamps: true });

// Create the Room model
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;