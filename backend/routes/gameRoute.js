const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new game room
router.post('/create', authMiddleware, gameController.createGame);
router.get('/all', authMiddleware, gameController.getGames);

// Start the game when all players have joined
router.post('/:roomId/start', authMiddleware, gameController.startGame);
router.get('/:roomId/questions', authMiddleware, gameController.getGameWithQuestions);
// Submit answers for scoring
router.post('/submit', authMiddleware, gameController.submitAnswer);
router.post('/end', authMiddleware, gameController.endGame);

module.exports = router;
