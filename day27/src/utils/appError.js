/**
 * Custom AppError Class for handling operational errors.
 * Operational errors are expected errors (like database failure, validation issues, route not found, etc.)
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Identifies this as a trusted operational error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
