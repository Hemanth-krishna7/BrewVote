const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Dashboard metrics path restricted to admin accounts only
router.get('/stats', protect, adminOnly, getStats);

module.exports = router;
