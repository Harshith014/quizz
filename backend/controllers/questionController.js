// controllers/questionController.js
const { fetchRandomQuestions } = require('../services/otdbServices');
const Question = require('../models/Question');

// Helper function to convert category string to number
const getCategoryId = (category) => {
    const categoryMap = {
        'general': 9,
        'books': 10,
        'film': 11,
        'music': 12,
        'science': 17,
        'computers': 18,
        'mathematics': 19,
        // Add more mappings as needed
    };
    return categoryMap[category.toLowerCase()] || null;
};

// controllers/questionController.js
exports.createQuestionPool = async (req, res) => {
    const { category, difficulty, questionCount } = req.body;

    try {
        const categoryId = getCategoryId(category);
        if (!categoryId) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const questions = await fetchRandomQuestions(questionCount, categoryId, difficulty);

        if (!questions || questions.length === 0) {
            return res.status(500).json({ message: 'No questions returned from Open Trivia DB' });
        }

        const preparedQuestions = questions.map((q) => {
            const options = [
                q.correct_answer,
                ...q.incorrect_answers,
            ];
            // Shuffle the options array to randomize the order
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            return new Question({
                category: q.category,
                difficulty: q.difficulty,
                question: q.question,
                correctAnswer: q.correct_answer,
                incorrectAnswers: q.incorrect_answers,
                options,
            });
        });

        const savedQuestions = await Question.insertMany(preparedQuestions);

        return res.status(201).json({ message: 'Question pool created successfully.', savedQuestions });
    } catch (error) {
        console.error('Error creating question pool:', error);
        return res.status(500).json({ message: 'Error creating question pool', error: error.message });
    }
};

exports.getSavedQuestions = async () => {
    try {
        // Fetch all saved questions from the database
        const questions = await Question.find({});
        console.log('Questions fetched:', questions);

        // Return the questions array directly
        return { questions };
    } catch (error) {
        console.error('Error fetching questions:', error);
        // You can either throw the error or return an empty array
        throw new Error('Error fetching questions');
    }
};