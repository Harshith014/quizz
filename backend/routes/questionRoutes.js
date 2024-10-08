// routes/questionRoutes.js
const express = require('express');
const { createQuestionPool, getCategories, getDifficultiesByCategory, countQuestionsByCategoryAndDifficulty } = require('../controllers/questionController');

const router = express.Router();

// Route to fetch random questions and save them
router.post('/generate', createQuestionPool);

// Route to get saved questions from the database
router.get('/categories', getCategories);

router.get('/difficulties/:category', getDifficultiesByCategory);

router.get('/count', countQuestionsByCategoryAndDifficulty);

module.exports = router;
