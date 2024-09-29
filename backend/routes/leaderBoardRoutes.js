const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const Leaderboard = require('../models/Leadboard');

router.get('/all',authMiddleware, async (req, res) => {
    try {
        const leaderboards = await Leaderboard.find().sort({ createdAt: -1 });
        
        // Format the leaderboard data
        const formattedLeaderboards = leaderboards.map(leaderboard => ({
            _id: leaderboard._id,
            roomId: leaderboard.roomId,
            gameId: leaderboard.gameId,
            createdAt: leaderboard.createdAt,
            leaderboard: leaderboard.leaderboard.map(entry => ({
                rank: entry.rank,
                userId: entry.userId,
                username: entry.username,
                points: entry.points,
                timeTaken: entry.timeTaken,
                correctAnswers: entry.correctAnswers
            }))
        }));

        res.json(formattedLeaderboards);
    } catch (error) {
        console.error('Error fetching leaderboards:', error);
        res.status(500).json({ error: 'An error occurred while fetching leaderboards' });
    }
});


module.exports = router;