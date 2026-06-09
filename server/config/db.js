const mongoose = require('mongoose');

/**
 * Connects to MongoDB asynchronously with connection retry logic.
 * Note: App startup is decoupled from active database connections.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('DATABASE WARNING: MONGODB_URI environment variable is not defined.');
    return;
  }

  const maxRetries = 5;
  const retryInterval = 5000; // 5 seconds

  const makeAttempt = async (attemptCount) => {
    try {
      await mongoose.connect(mongoURI);
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error(`Database connection attempt #${attemptCount} failed: ${error.message}`);
      
      if (attemptCount < maxRetries) {
        console.log(`Retrying database connection in ${retryInterval / 1000} seconds...`);
        setTimeout(() => makeAttempt(attemptCount + 1), retryInterval);
      } else {
        console.error('All database connection retries exhausted. The application will run without database connectivity.');
      }
    }
  };

  // Trigger initial connection attempt asynchronously to avoid blocking server boot
  makeAttempt(1);
};

module.exports = connectDB;
