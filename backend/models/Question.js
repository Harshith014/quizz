// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: String,
    difficulty: String,
    question: String,
    correctAnswer: String,
    incorrectAnswers: [String],
    options: [{ type: String, required: true }],
    timer: { type: Number, default: 10 } // Default timer for each question
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
