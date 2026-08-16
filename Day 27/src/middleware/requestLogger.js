const logger = require('../config/logger');

/**
 * Middleware to log HTTP requests.
 * Automatically tracks request details, execution time, and logs with appropriate level.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms [IP: ${ip}]`;

    // Categorize log level based on response status code
    if (statusCode >= 500) {
      logger.error(message);
    } else if (statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
};

module.exports = requestLogger;
