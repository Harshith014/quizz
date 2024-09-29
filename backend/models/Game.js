// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Store question IDs
    currentQuestionIndex: { type: Number, default: 0 },
    status: { type: String, enum: ['not_started', 'started', 'ended'], default: 'not_started' },
    results: [
        {
            player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            correctAnswers: { type: Number, default: 0 },
            totalTime: { type: Number, default: 0 },
            points: { type: Number, default: 0 }
        }
    ]
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;

