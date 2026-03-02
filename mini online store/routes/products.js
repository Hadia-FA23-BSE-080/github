// ============================================
// FILE: routes/products.js
// ============================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - Get all products
router.get('/', productController.getAllProducts);

module.exports = router;