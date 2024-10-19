// auth.middleware.js

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.access_token; // Get token from cookies
    if (!token) {
        return res.sendStatus(403); // Forbidden if no token is found
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Attach user information to request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Middleware to check user role (optional)
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403); // Forbidden if user role is not authorized
        }
        next(); // Proceed if authorized
    };
};

module.exports = { authenticateJWT, authorizeRole };