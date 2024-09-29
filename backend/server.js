require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoute');
const questionRoutes = require('./routes/questionRoutes');

const leaderboardRoutes = require('./routes/leaderBoardRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');
const cors = require('cors');
const gameController = require('./controllers/gameController');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes); // Add leaderboard routes

// Protected route example (for testing authentication)
app.get('/api/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Accessed protected route!', user: req.user });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});