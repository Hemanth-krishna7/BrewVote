const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional authentication middleware.
 * If a valid JWT Bearer token is provided, attaches the user context to req.user.
 * If the token is missing, expired, or invalid, it silently continues execution.
 */
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded && decoded.id) {
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
      // Continue silently on invalid/expired tokens for public endpoints
      console.warn('Optional JWT verification failed:', error.message);
    }
  }
  next();
};

module.exports = optionalAuth;
