const express = require('express');
const router = express.Router();
const { castVote, checkVote, getLeaderboard } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// Public route to retrieve leaderboard
router.get('/leaderboard', getLeaderboard);

// Private routes requiring authentication
router.post('/:coffeeId', protect, validateObjectId, castVote);
router.get('/check/:coffeeId', protect, validateObjectId, checkVote);

module.exports = router;
