const logger = require('../config/logger');

/**
 * Global Error Handling Middleware.
 * Captures all synchronous and asynchronous errors and logs them using Winston.
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Sanitize request body if it contains sensitive information (optional, but good practice)
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) sanitizedBody.password = '***REDACTED***';
  if (sanitizedBody.token) sanitizedBody.token = '***REDACTED***';

  // Log error using Winston, capturing full error details and request metadata
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
    metadata: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: Object.keys(sanitizedBody).length ? sanitizedBody : undefined,
      query: Object.keys(req.query).length ? req.query : undefined,
      params: Object.keys(req.params).length ? req.params : undefined
    }
  });

  // Response structure changes based on environment (development vs production)
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(isDev && { 
      stack: err.stack,
      error: err 
    }),
    ...(!isDev && !err.isOperational && {
      message: 'An unexpected error occurred. Please try again later.'
    })
  });
};

module.exports = errorHandler;
