const express = require('express');
const router = express.Router();
const {
  getCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee
} = require('../controllers/coffeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const validateObjectId = require('../middleware/validateObjectId');
const { validateCreateCoffee, validateUpdateCoffee } = require('../validators/coffeeValidator');

// Public routes (accessible by anyone)
router.get('/', getCoffees);
router.get('/:id', optionalAuth, validateObjectId, getCoffeeById);

// Protected routes (require authenticated user profile)
router.post('/', protect, validateCreateCoffee, createCoffee);

// Admin-only protected routes (require authenticated admin privileges)
router.put('/:id', protect, adminOnly, validateObjectId, validateUpdateCoffee, updateCoffee);
router.delete('/:id', protect, adminOnly, validateObjectId, deleteCoffee);

module.exports = router;
