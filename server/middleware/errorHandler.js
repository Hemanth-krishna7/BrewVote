/**
 * Centralized error handler middleware.
 * Formats errors into clean JSON payloads.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Exception:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const payload = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
