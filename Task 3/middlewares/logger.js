/**
 * Returns the current date & time formatted as "YYYY-MM-DD HH:MM:SS"
 */
const getTimestamp = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Global Logger Middleware
 * Logs every incoming request's timestamp, HTTP method, and URL path.
 */
const logger = (req, res, next) => {
  const timestamp = getTimestamp();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  // MUST call next() — otherwise request stops here and never reaches routes
  next();
};

/**
 * Route-Specific Middleware (Bonus)
 * Only used on POST and PUT routes to log data modification requests.
 */
const modificationLogger = (req, res, next) => {
  const timestamp = getTimestamp();
  console.log(`Incoming data modification request at ${timestamp}`);

  next();
};

module.exports = { logger, modificationLogger };
