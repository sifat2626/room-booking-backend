const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }

        // Create a new user
        const newUser = new User({name, email, password});
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({id: newUser._id, role: newUser.role}, process.env.JWT_SECRET, {expiresIn: "1d"});

        // Set the token as an HTTP-only cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 24*60 * 60 * 1000,
        });

        // Respond with success message and user details (excluding password)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 24*60 * 60 * 1000,
        });

        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user details
const updateUserDetails = async (req, res) => {
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select("-password"); // Exclude password

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { registerUser, loginUser, getUserDetails, updateUserDetails };