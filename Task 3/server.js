const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const { logger } = require("./middlewares/logger.js");

const app = express();
const PORT = 5000;

// CORS — allow requests from any frontend origin
app.use(cors());

// Global logger — MUST be before routes so every request gets logged
app.use(logger);

// Parse incoming JSON request bodies
app.use(express.json());

// Simple test route — open http://localhost:5000 to verify middleware logs
app.get("/", (req, res) => {
  res.status(200).send("API is working");
});

// Mount book routes at /api/books
app.use("/api/books", bookRoutes);

// Start server with proper error handling (Express 5 passes errors to callback)
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }

  console.log(`Book Store API is running on http://localhost:${PORT}`);
});

// Handle unexpected server errors while running
server.on("error", (err) => {
  console.error(`Server error: ${err.message}`);
  process.exit(1);
});
