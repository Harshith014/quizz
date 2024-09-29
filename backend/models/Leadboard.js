const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    leaderboard: [{
        rank: Number,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        points: Number,
        timeTaken: Number,
        correctAnswers: Number
    }],
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);