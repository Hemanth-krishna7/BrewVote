const sanitize = require('../utils/sanitize');

/**
 * Middleware validators for coffee requests.
 */

const validateCreateCoffee = (req, res, next) => {
  const { name, description, imageUrl } = req.body;

  const sanitizedName = sanitize(name);
  const sanitizedDescription = sanitize(description);

  if (!sanitizedName) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a coffee name.'
    });
  }

  if (!sanitizedDescription) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a description.'
    });
  }

  if (!imageUrl || !imageUrl.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image URL.'
    });
  }

  // Validate Image URL using native URL constructor
  try {
    new URL(imageUrl.trim());
  } catch (urlError) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid image URL.'
    });
  }

  // Bind sanitized strings back to body
  req.body.name = sanitizedName;
  req.body.description = sanitizedDescription;
  req.body.imageUrl = imageUrl.trim();

  next();
};

const validateUpdateCoffee = (req, res, next) => {
  const { name, description, imageUrl } = req.body;

  const sanitizedName = sanitize(name);
  const sanitizedDescription = sanitize(description);

  if (!sanitizedName) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a coffee name.'
    });
  }

  if (!sanitizedDescription) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a description.'
    });
  }

  if (!imageUrl || !imageUrl.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image URL.'
    });
  }

  // Validate Image URL using native URL constructor
  try {
    new URL(imageUrl.trim());
  } catch (urlError) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid image URL.'
    });
  }

  // Bind sanitized strings back to body
  req.body.name = sanitizedName;
  req.body.description = sanitizedDescription;
  req.body.imageUrl = imageUrl.trim();

  next();
};

module.exports = {
  validateCreateCoffee,
  validateUpdateCoffee
};
