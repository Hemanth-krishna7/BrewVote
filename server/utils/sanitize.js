/**
 * Sanitizes input strings by stripping HTML/XML tags and trimming whitespace.
 * @param {string} text
 * @returns {string}
 */
const sanitize = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/<[^>]*>/g, '').trim();
};

module.exports = sanitize;
