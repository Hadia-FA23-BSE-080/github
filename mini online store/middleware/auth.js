// ============================================
// FILE: middleware/auth.js
// ============================================

/**
 * Authentication Middleware
 * Simulates checking if user is authenticated via token
 */

const auth = (req, res, next) => {
    // Get authorization header from request
    const authHeader = req.headers.authorization;
    
    // Check if token exists and is valid
    // Expected format: "Bearer my-secret-token"
    if (authHeader && authHeader === 'Bearer my-secret-token') {
        console.log('✅ Authentication successful');
        next(); // User is authenticated, proceed to route handler
    } else {
        console.log('❌ Authentication failed');
        // Send 401 Unauthorized response
        res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Valid authentication token required. Use: Bearer my-secret-token'
        });
    }
};

module.exports = auth;