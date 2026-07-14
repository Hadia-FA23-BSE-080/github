const books = require("../models/bookModel");

/** Required fields for creating or updating a book */
const REQUIRED_FIELDS = ["title", "author", "publishedYear", "genre"];

/**
 * Validates that all required book fields are present and non-empty.
 * @param {object} body - Request body from req.body
 * @returns {string|null} Error message if validation fails, otherwise null
 */
const validateBookFields = (body) => {
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (typeof body.publishedYear !== "number" || isNaN(body.publishedYear)) {
    return "publishedYear must be a valid number";
  }

  return null;
};

/**
 * GET /api/books
 * Returns all books in the store.
 */
const getAllBooks = (req, res) => {
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
};

/**
 * GET /api/books/:id
 * Returns a single book by its ID.
 */
const getBookById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: book,
  });
};

/**
 * POST /api/books
 * Creates a new book and adds it to the in-memory store.
 */
const createBook = (req, res) => {
  const validationError = validateBookFields(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const { title, author, publishedYear, genre } = req.body;

  const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  const newBook = {
    id: newId,
    title,
    author,
    publishedYear,
    genre,
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: newBook,
  });
};

/**
 * PUT /api/books/:id
 * Updates an existing book by its ID.
 */
const updateBook = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found`,
    });
  }

  const validationError = validateBookFields(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const { title, author, publishedYear, genre } = req.body;

  books[bookIndex] = {
    id,
    title,
    author,
    publishedYear,
    genre,
  };

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: books[bookIndex],
  });
};

/**
 * DELETE /api/books/:id
 * Removes a book from the in-memory store by its ID.
 */
const deleteBook = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found`,
    });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: deletedBook,
  });
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
