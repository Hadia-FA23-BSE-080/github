// ============================================
// FILE: routes/users.js
// ============================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// POST /users - Create new user
router.post('/', userController.createUser);

module.exports = router;