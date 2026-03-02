const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// ========== PRODUCTS ROUTES ==========
// GET /products - Returns all products
app.get('/products', (req, res) => {
    const products = [
        { id: 1, name: 'Laptop', price: 999.99 },
        { id: 2, name: 'Mouse', price: 29.99 },
        { id: 3, name: 'Keyboard', price: 79.99 },
        { id: 4, name: 'Monitor', price: 299.99 }
    ];
    
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// ========== USERS ROUTES ==========
// GET /users/:id - Get user by ID (NO AUTHENTICATION REQUIRED)
app.get('/users/:id', (req, res) => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    const userId = parseInt(req.params.id);
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
});

// POST /users - Create new user (NO AUTHENTICATION REQUIRED)
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Missing fields',
            message: 'Please provide both name and email'
        });
    }
    
    // Create new user
    const newUser = {
        id: Math.floor(Math.random() * 1000), // Random ID
        name: name,
        email: email
    };
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

// ========== HOME ROUTE ==========
app.get('/', (req, res) => {
    res.send('API is working! Try these routes:\n- GET /products\n- GET /users/1\n- POST /users');
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: 'The URL you requested does not exist'
    });
});

// ========== START SERVER ==========
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log('\n📌 Available endpoints:');
    console.log('   GET  → http://localhost:3000/products');
    console.log('   GET  → http://localhost:3000/users/1');
    console.log('   POST → http://localhost:3000/users');
});