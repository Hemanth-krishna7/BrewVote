const express = require('express');
const router = express.Router();

/**
 * @desc    Health check route
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'System health check passed.',
    data: {
      status: 'ok'
    }
  });
});

module.exports = router;
