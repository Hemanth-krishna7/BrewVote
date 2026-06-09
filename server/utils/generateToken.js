const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token (JWT) signed with the server secret.
 * @param {object} user - The user document object containing _id and role
 * @returns {string} Signed JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
