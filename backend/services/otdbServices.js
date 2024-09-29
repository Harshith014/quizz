const axios = require('axios');
const BASE_URL = 'https://opentdb.com/api.php';

const fetchRandomQuestions = async (amount, category, difficulty, type = 'multiple') => {
    try {
        const params = {
            amount,
            difficulty,
            type
        };

        // Only add category if it's provided and is a number
        if (category && !isNaN(category)) {
            params.category = category;
        }

        const url = `${BASE_URL}?${new URLSearchParams(params)}`;
        console.log('Requesting URL:', url);

        const response = await axios.get(url);

        console.log('OTDB Response:', response.data);

        if (response.data.response_code !== 0) {
            throw new Error(`Failed to fetch questions. OTDB Response Code: ${response.data.response_code}`);
        }

        return response.data.results;
    } catch (error) {
        console.error('Error fetching questions from OTDB:', error);
        throw error;
    }
};

module.exports = { fetchRandomQuestions };