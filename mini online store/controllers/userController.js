// ============================================
// FILE: controllers/userController.js
// ============================================

// Dummy users data (in real app, this would come from database)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /users/:id - Get user by ID
const getUserById = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        console.log(`👤 UserController: Searching for user with ID: ${userId}`);
        
        // Check if userId is valid number
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format',
                message: 'User ID must be a number'
            });
        }
        
        const user = users.find(u => u.id === userId);
        
        if (user) {
            res.status(200).json({
                success: true,
                data: user
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'User not found',
                message: `No user exists with ID: ${userId}`
            });
        }
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Something went wrong while fetching user'
        });
    }
};

// POST /users - Create new user
const createUser = (req, res) => {
    try {
        console.log('📝 UserController: Creating new user with data:', req.body);
        
        const { name, email } = req.body;
        
        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'Please provide both name and email in request body'
            });
        }
        
        // Validate email format (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
                message: 'Please provide a valid email address'
            });
        }
        
        // Create new user with auto-incrementing ID
        const newUser = {
            id: users.length + 1,
            name: name.trim(),
            email: email.trim().toLowerCase()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Send success response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
        
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Something went wrong while creating user'
        });
    }
};

module.exports = {
    getUserById,
    createUser
};