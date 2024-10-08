// controllers/questionController.js
const { fetchRandomQuestions } = require('../services/otdbServices');
const Question = require('../models/Question');

// Helper function to convert category string to number
const getCategoryId = (category) => {
    // Remove the prefix before the colon (if it exists)
    const cleanedCategory = category.includes(': ') ? category.split(': ')[1] : category;

    const categoryMap = {
        'general knowledge': 9,
        'books': 10,
        'film': 11,
        'music': 12,
        'computers': 18,
        'mathematics': 19,
        'science': 10
        // Add more mappings as needed
    };

    return categoryMap[cleanedCategory.toLowerCase()] || null;
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
        });

        const savedQuestions = await Question.insertMany(preparedQuestions);

        return res.status(201).json({ message: 'Question pool created successfully.', savedQuestions });
    } catch (error) {
        console.error('Error creating question pool:', error);
        return res.status(500).json({ message: 'Error creating question pool', error: error.message });
    }
};

// Fetch all unique categories from the database
exports.getCategories = async (req, res) => {
    try {
        const categories = await Question.distinct('category');
        return res.status(200).json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// controllers/questionController.js
exports.getDifficultiesByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const categoryId = getCategoryId(category);
        if (!categoryId) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const difficulties = await Question.distinct('difficulty', { category: category });

        return res.status(200).json({ difficulties });
    } catch (error) {
        console.error('Error fetching difficulties:', error);
        return res.status(500).json({ message: 'Error fetching difficulties', error: error.message });
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

// Controller to count the number of questions for a particular category and difficulty
exports.countQuestionsByCategoryAndDifficulty = async (req, res) => {
    const { category, difficulty } = req.query; // Expecting category and difficulty from the query string

    try {
        // Count the number of documents that match both category and difficulty
        const questionCount = await Question.countDocuments({ category, difficulty });

        return res.status(200).json({ questionCount });
    } catch (error) {
        console.error('Error counting questions:', error);
        return res.status(500).json({ message: 'Error counting questions', error: error.message });
    }
};