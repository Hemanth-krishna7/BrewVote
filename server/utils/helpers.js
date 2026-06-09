/**
 * Application utility helper functions
 */

/**
 * Placeholder JWT generation helper
 * @param {string} userId
 * @returns {string} token
 */
const generateMockToken = (userId) => {
  console.log('utils.generateMockToken placeholder executed for userId:', userId);
  return 'mock-jwt-token-from-helpers';
};

/**
 * Response payload wrapper
 * @param {boolean} success
 * @param {string} message
 * @param {any} data
 */
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data
  };
};

module.exports = {
  generateMockToken,
  formatResponse
};
