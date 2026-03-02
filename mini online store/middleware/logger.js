// ============================================
// FILE: middleware/logger.js
// ============================================

/**
 * Logger Middleware
 * Logs every incoming request method and URL
 */

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request received at: ${req.url}`);
    
    // Call next() to pass control to the next middleware/route handler
    next();
};

module.exports = logger;