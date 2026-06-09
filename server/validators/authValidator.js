const sanitize = require('../utils/sanitize');

/**
 * Middleware validators for authentication inputs.
 */

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const sanitizedName = sanitize(name);
  const sanitizedEmail = sanitize(email).toLowerCase();

  if (!sanitizedName) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a name.'
    });
  }

  if (!sanitizedEmail) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email address.'
    });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.'
    });
  }

  // Update request body with sanitized parameters
  req.body.name = sanitizedName;
  req.body.email = sanitizedEmail;

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const sanitizedEmail = sanitize(email).toLowerCase();

  if (!sanitizedEmail) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email address.'
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a password.'
    });
  }

  // Update request body with sanitized parameters
  req.body.email = sanitizedEmail;

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
