# Task 1 - Basic Express.js Server

## 📌 Project Description

This is a simple **Node.js** web server built using the **Express.js** framework. It serves as a basic starter project that demonstrates how to set up and run a minimal HTTP server.

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | — | JavaScript runtime environment |
| Express.js | ^5.2.1 | Web framework for handling HTTP requests |

## 📁 Project Structure

```
Task 1/
├── index.js            # Main server file (entry point)
├── package.json        # Project configuration and dependencies
├── package-lock.json   # Dependency lock file
├── node_modules/       # Installed packages
└── README.md           # Project documentation (this file)
```

## ⚙️ How It Works

- The server is created using **Express.js**.
- It listens on **port 3000**.
- It has a single route:
  - `GET /` → Returns `"Hello World"` as a response.

## 🚀 How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   node index.js
   ```

3. **Open in browser:**

   Visit [http://localhost:3000](http://localhost:3000) to see the output.

## 📄 API Endpoints

| Method | Route | Response |
|--------|-------|----------|
| GET    | `/`   | `Hello World` |

## 📦 Dependencies

- **express** (`^5.2.1`) — A fast, minimalist web framework for Node.js used to create the server and define routes.

## 📝 Notes

- This project uses **CommonJS** module system (`"type": "commonjs"` in `package.json`).
- The server runs on port **3000** by default.
- This is a beginner-level project ideal for learning the basics of Express.js and Node.js server setup.

---

> **Status:** ✅ Running & Working
