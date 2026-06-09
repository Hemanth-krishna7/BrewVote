/**
 * Converts a string into a clean, URL-friendly slug.
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Replaces non-alphanumeric characters (except hyphens) with empty string
 * - Replaces duplicate hyphens with a single hyphen
 * - Trims leading/trailing hyphens
 * @param {string} text
 * @returns {string} slug
 */
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

module.exports = slugify;
