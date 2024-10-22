// server.js or app.js

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const roomRoutes = require("./routes/Room.route");
const bookingRoutes = require("./routes/Booking.route");
const userRoutes = require("./routes/User.route"); // Assuming you have user routes as well

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:3000",'https://room-booking-frontend-q5jv.vercel.app'], // Adjust based on your front-end URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))


// Mount routes with prefixes
app.use("/api/v1/rooms", roomRoutes); // Mount room routes under /room
app.use("/api/v1/bookings", bookingRoutes); // Mount booking routes under /booking
app.use("/api/v1/users", userRoutes); // Mount user routes under /users

// Connect to MongoDB and start server
mongoose.connect(process.env.DATABASE)
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => console.log(err));