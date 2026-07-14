/**
 * In-memory data store for books.
 * No database is used — data lives in this array for the lifetime of the server.
 */

const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publishedYear: 1960,
    genre: "Fiction",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    publishedYear: 1949,
    genre: "Dystopian",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publishedYear: 1925,
    genre: "Classic",
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    publishedYear: 2011,
    genre: "Non-Fiction",
  },
];

module.exports = books;
