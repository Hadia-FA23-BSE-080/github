// ============================================
// FILE: controllers/productController.js
// ============================================

// Dummy products data (in real app, this would come from database)
const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics' },
    { id: 3, name: 'T-Shirt', price: 19.99, category: 'Clothing' },
    { id: 4, name: 'Book', price: 15.99, category: 'Books' }
];

// Controller function for GET /products
const getAllProducts = (req, res) => {
    try {
        console.log('📦 ProductController: Fetching all products');
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Something went wrong while fetching products'
        });
    }
};

module.exports = {
    getAllProducts
};