const express = require("express");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = 5000;

// Parse incoming JSON request bodies
app.use(express.json());

// Mount book routes at /api/books
app.use("/api/books", bookRoutes);

// Root route — quick health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Book Store API",
    endpoints: {
      getAllBooks: "GET /api/books",
      getBookById: "GET /api/books/:id",
      createBook: "POST /api/books",
      updateBook: "PUT /api/books/:id",
      deleteBook: "DELETE /api/books/:id",
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Book Store API is running on http://localhost:${PORT}`);
});
