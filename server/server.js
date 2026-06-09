const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Configurations
const connectDB = require('./config/db');

// Route Imports
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const coffeesRouter = require('./routes/coffees');
const votesRouter = require('./routes/votes');
const adminRouter = require('./routes/admin');

// Middleware Imports
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Security headers
app.use(helmet());

// Rate limiting for auth endpoints (10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mount Route Limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Mount Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/coffees', coffeesRouter);
app.use('/api/votes', votesRouter);
app.use('/api/admin', adminRouter);

// Base route fallback handler
app.use('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Centralized error handling
app.use(errorHandler);

// Listen to port
const server = app.listen(PORT, () => {
  console.log(`BrewVote Server starting in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

module.exports = app; // For future unit test frameworks
