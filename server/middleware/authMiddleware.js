const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT authentication guard.
 * Validates bearer token and attaches user object to request.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token signatures
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database and attach to req.user (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User record no longer exists.'
        });
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Token signature verification failed.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No authorization token provided.'
    });
  }
};

/**
 * Admin authorization guard.
 * Rejects requests if user is not an administrator.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access privilege required.'
  });
};

module.exports = {
  protect,
  adminOnly
};
