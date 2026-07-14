const express = require("express");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

// GET    /api/books      → Get all books
router.get("/", getAllBooks);

// GET    /api/books/:id  → Get a single book by ID
router.get("/:id", getBookById);

// POST   /api/books      → Create a new book
router.post("/", createBook);

// PUT    /api/books/:id  → Update an existing book
router.put("/:id", updateBook);

// DELETE /api/books/:id  → Delete a book
router.delete("/:id", deleteBook);

module.exports = router;
