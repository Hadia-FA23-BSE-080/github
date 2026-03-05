const express = require('express');
const cors = require('cors');
// Yeh package automatically file-based database handle karega
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// 🚀 DATABASE SETUP (SQLite)
// ==========================================
// Yeh code project me 'exam_database.db' naam ki database file banayega.
const db = new sqlite3.Database('./exam_database.db', (err) => {
    if (err) console.error(err.message);
    console.log('🔗 Connected to SQLite real database!');
});

// Tables banayen agar pehle se nahi bani hui
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        totalMarks INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT,
        examName TEXT,
        obtainedMarks INTEGER
    )`);
});

// ==========================================
// 1. STUDENTS API
// ==========================================

// GET: Sare students dekhein
app.get('/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST: Naya student add karein
app.post('/students', (req, res) => {
    const query = "INSERT INTO students (name, email) VALUES (?, ?)";
    db.run(query, [req.body.name, req.body.email], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Student saved in Database!", id: this.lastID });
    });
});

// DELETE: Ek student ko delete karein
app.delete('/students/:id', (req, res) => {
    const query = "DELETE FROM students WHERE id = ?";
    db.run(query, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted successfully!" });
    });
});


// ==========================================
// 2. EXAMS API
// ==========================================

// GET: Sare exams dekhein
app.get('/exams', (req, res) => {
    db.all("SELECT * FROM exams", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST: Naya exam create karein
app.post('/exams', (req, res) => {
    const query = "INSERT INTO exams (title, totalMarks) VALUES (?, ?)";
    db.run(query, [req.body.title, req.body.totalMarks], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Exam saved in Database!", id: this.lastID });
    });
});


// ==========================================
// 3. RESULTS API
// ==========================================

// GET: Sare results dekhein
app.get('/results', (req, res) => {
    db.all("SELECT * FROM results", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST: Exam submit karein aur result save karein
app.post('/results', (req, res) => {
    const query = "INSERT INTO results (studentName, examName, obtainedMarks) VALUES (?, ?, ?)";
    db.run(query, [req.body.studentName, req.body.examName, req.body.obtainedMarks], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Result saved in Database!", id: this.lastID });
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Exam API with Real Database running on http://localhost:${PORT}`);
});
