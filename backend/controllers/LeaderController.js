
const Game = require('../models/Game');
const Leaderboard = require('../models/Leadboard');

exports.updateAndGetLeaderboard = async (roomId) => {
    try {
        const game = await Game.findOne({ roomId })
            .populate('results.player', 'username')
            .lean();

        if (!game) {
            throw new Error('Game not found');
        }

        // Sort results by points (descending) and then by totalTime (ascending)
        game.results.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return a.totalTime - b.totalTime;
        });

        const formattedLeaderboard = game.results.map((entry, index) => ({
            rank: index + 1,
            userId: entry.player._id,
            username: entry.player.username,
            points: entry.points,
            timeTaken: entry.totalTime,
            correctAnswers: entry.correctAnswers
        }));

        // Store the leaderboard in the Leaderboard model
        await Leaderboard.findOneAndUpdate(
            { roomId: roomId },
            { 
                roomId: roomId,
                leaderboard: formattedLeaderboard,
                gameId: game._id
            },
            { upsert: true, new: true }
        );

        return formattedLeaderboard;
    } catch (error) {
        console.error('Error updating and fetching leaderboard:', error);
        throw error;
    }
};

// New function to get all leaderboards
exports.getAllLeaderboards = async () => {
    try {
        const leaderboards = await Leaderboard.find().sort({ createdAt: -1 }).populate('gameId');
        return leaderboards;
    } catch (error) {
        console.error('Error fetching all leaderboards:', error);
        throw error;
    }
};