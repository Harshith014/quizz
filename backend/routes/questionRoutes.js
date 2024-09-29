// routes/questionRoutes.js
const express = require('express');
const { createQuestionPool, getSavedQuestions } = require('../controllers/questionController');

const router = express.Router();

// Route to fetch random questions and save them
router.post('/generate', createQuestionPool);

// Route to get saved questions from the database
router.get('/fetch', getSavedQuestions);

module.exports = router;
