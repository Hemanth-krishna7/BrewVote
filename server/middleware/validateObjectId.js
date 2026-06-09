const mongoose = require('mongoose');

/**
 * Middleware to validate MongoDB ObjectIds in request parameters.
 * Validates 'id' and 'coffeeId' parameter fields.
 */
const validateObjectId = (req, res, next) => {
  const { id, coffeeId } = req.params;

  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.'
    });
  }

  if (coffeeId && !mongoose.Types.ObjectId.isValid(coffeeId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.'
    });
  }

  next();
};

module.exports = validateObjectId;
