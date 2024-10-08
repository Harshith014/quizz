const Game = require('../models/Game');
const Question = require('../models/Question');
const questionController = require('./questionController');
const leaderboardController = require('./LeaderController');
const User = require('../models/User');

// Create a new game
exports.createGame = async (req, res) => {
    const { roomId, category, difficulty, questionCount } = req.body;


    // Check if all required fields are present
    if (!roomId || !category || !difficulty || !questionCount) {
        return res.status(400).json({ message: 'Missing required fields. Please provide roomId, category, difficulty, and questionCount.' });
    }

    try {
        // Check if a game room with the same roomId already exists
        const existingGame = await Game.findOne({ roomId });
        if (existingGame) {
            return res.status(400).json({ message: 'Room ID already exists. Please choose a different room ID.' });
        }

        // Fetch all saved questions from the database using your questionController
        const savedQuestionsResult = await questionController.getSavedQuestions();


        // Check if questions were retrieved successfully
        if (!savedQuestionsResult.questions || savedQuestionsResult.questions.length === 0) {
            return res.status(400).json({ message: 'No questions found in the database.' });
        }

        // Filter questions based on category and difficulty
        const filteredQuestions = savedQuestionsResult.questions.filter(q => {
            if (!q || typeof q !== 'object') {
                console.warn('Invalid question object:', q);
                return false;
            }

            if (!q.category || !q.difficulty) {
                console.warn('Question missing category or difficulty:', q);
                return false;
            }

            const categoryMatch = q.category.toString().toLowerCase().includes(category.toString().toLowerCase());
            const difficultyMatch = q.difficulty.toString().toLowerCase() === difficulty.toString().toLowerCase();

            return categoryMatch && difficultyMatch;
        });

        // Check if there are enough questions
        if (filteredQuestions.length < questionCount) {
            return res.status(400).json({
                message: 'Not enough questions available for the specified criteria.',
                availableQuestions: filteredQuestions.length,
                requestedQuestions: questionCount
            });
        }

        // Select the first `questionCount` questions
        const selectedQuestions = filteredQuestions.slice(0, questionCount);

        // Create the game in MongoDB
        const game = new Game({
            roomId,
            questions: selectedQuestions.map(q => q._id), // Store only the question IDs
            status: 'not_started',
            category,
            difficulty,
            questionCount
        });

        await game.save();

        // Respond with success
        res.status(201).json({ message: 'Game room created successfully', game });
    } catch (error) {
        console.error('Error creating game room:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all games
exports.getGames = async (req, res) => {
    try {
        const games = await Game.find()
            .populate({
                path: 'questions', // Populate the questions field
                select: 'category difficulty' // Only select the fields you need
            })
            .lean(); // Returns plain JavaScript objects

        const formattedGames = games.map((game) => ({
            roomId: game.roomId,
            category: game.questions[0]?.category || 'N/A', // Use the category from the first question
            difficulty: game.questions[0]?.difficulty || 'N/A', // Use the difficulty from the first question
            questionCount: game.questions.length // Calculate question count
        }));

        res.status(200).json({ games: formattedGames });
    } catch (error) {
        console.error('Error getting games:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Start a new game
exports.startGame = async (req, res) => {
    const { roomId } = req.params; // Retrieve roomId from URL parameter

    try {
        // Check if the game with the given roomId exists and is in the waiting state
        const game = await Game.findOne({ roomId }).populate('questions');
        if (!game) {
            return res.status(404).json({ message: 'Game room not found.' });
        }
        if (game.status === 'started') {
            return res.status(400).json({ message: 'Game already started.' });
        }

        // Update game state to started
        game.status = 'started';
        game.currentQuestionIndex = 0;
        await game.save();

        res.status(200).json({ message: 'Game started', gameId: game._id });
    } catch (error) {
        console.error('Error starting game:', error);
        res.status(500).json({ message: 'Error starting game', error: error.message });
    }
};

// Submit an answer
exports.submitAnswer = async (req, res) => {
    const { roomId, userId, questionIndex, selectedOption, startTime, isCorrect } = req.body;

    try {
        const game = await Game.findOne({ roomId });
        if (!game) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        let playerResult = game.results.find(result => result.player.toString() === userId);
        if (!playerResult) {
            playerResult = {
                player: userId,
                correctAnswers: 0,
                totalTime: 0,
                points: 0
            };
            game.results.push(playerResult);
        }

        const timeTaken = Date.now() - startTime;

        if (isCorrect) {
            playerResult.correctAnswers += 1;
            playerResult.points += 10;
        }
        playerResult.totalTime += timeTaken;

        await game.save();

        // Update user's total points and games played
        await User.findByIdAndUpdate(userId, {
            $inc: { points: isCorrect ? 10 : 0, gamesPlayed: 1 }
        });

        // Get updated leaderboard
        const leaderboard = await leaderboardController.updateAndGetLeaderboard(roomId);

        res.status(200).json({
            success: true,
            isCorrect,
            playerResult: {
                correctAnswers: playerResult.correctAnswers,
                totalTime: playerResult.totalTime,
                points: playerResult.points
            },
            leaderboard
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get game with questions
exports.getGameWithQuestions = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Find the game by roomId and populate the questions
        const game = await Game.findOne({ roomId }).populate('questions');

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Format questions to include numbered options
        const formattedQuestions = game.questions.map((question) => {
            const options = [...question.incorrectAnswers]; // Copy incorrect answers

            // Randomly insert the correct answer into the options
            const correctAnswerIndex = Math.floor(Math.random() * (options.length + 1));
            options.splice(correctAnswerIndex, 0, question.correctAnswer);

            // Map options to numbered choices
            const numberedOptions = options.map((option, index) => ({
                optionNumber: index + 1, // 1-based numbering
                optionText: option
            }));

            return {
                questionText: question.question,
                options: numberedOptions,
                correctOption: correctAnswerIndex + 1 // 1-based index for the correct answer
            };
        });

        // Shuffle the questions
        const shuffledQuestions = shuffle(formattedQuestions);

        // Return the shuffled questions
        res.status(200).json({ gameId: game._id, questions: shuffledQuestions });
    } catch (error) {
        console.error('Error fetching game with questions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// End game
exports.endGame = async (req, res) => {
    try {
        const { roomId } = req.body;

        const game = await Game.findOne({ roomId });

        if (!game || game.status !== 'started') {
            return res.status(404).json({ message: 'Game not found or not started' });
        }

        game.status = 'ended';
        await game.save();

        res.status(200).json({ message: 'Game ended successfully', game });

    } catch (error) {
        console.error('Error ending game:', error);
        res.status(500).json({ message: 'Server error' });
    }
};