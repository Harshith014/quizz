const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate Access Token (short-lived)
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user with hashed password
        const user = new User({
            email,
            username,
            password, // Password will be hashed in the pre-save hook
        });

        // Save the user
        await user.save();

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set tokens as HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            // maxAge: 15 * 60 * 1000, // 15 minutes
            maxAge: 1 * 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user._id, email: user.email, username: user.username } });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set tokens as HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            // maxAge: 15 * 60 * 1000, // 15 minutes
            maxAge: 1 * 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email, username: user.username }, token: accessToken });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Token Refresh
exports.refreshToken = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not found' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(user);
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).json({ message: 'Access token refreshed', token: newAccessToken });
    });
};


// User Logout
exports.logout = (req, res) => {
    // Clear the access and refresh token cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
};

