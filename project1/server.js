const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Use PORT 5000 (3000 avoid karo)
const PORT = 5000;

// Middleware - IMPORTANT!
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/testdb')
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.log('❌ MongoDB Error:', err));

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});
const User = mongoose.model('User', userSchema);

// ========== ROUTES ==========

// 1. Home Page with Form
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CRUD App</title>
            <style>
                body { background: #f0f2f5; font-family: Arial; padding: 20px; }
                .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; }
                h1 { text-align: center; color: #333; }
                input, button { width: 100%; padding: 10px; margin: 10px 0; border-radius: 5px; }
                input { border: 1px solid #ddd; }
                button { background: #28a745; color: white; border: none; cursor: pointer; }
                button:hover { background: #218838; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #007bff; color: white; padding: 10px; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>User Management</h1>
                
                <form action="/add-user" method="POST">
                    <input type="text" name="name" placeholder="Enter Name" required>
                    <input type="email" name="email" placeholder="Enter Email" required>
                    <input type="number" name="age" placeholder="Enter Age" required>
                    <button type="submit">Add User</button>
                </form>
                
                <h2>Users List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody id="users"></tbody>
                </table>
            </div>
            
            <script>
                // Load users function
                async function loadUsers() {
                    const response = await fetch('/get-users');
                    const users = await response.json();
                    
                    let html = '';
                    users.forEach(user => {
                        html += '<tr>' +
                            '<td>' + user.name + '</td>' +
                            '<td>' + user.email + '</td>' +
                            '<td>' + user.age + '</td>' +
                        '</tr>';
                    });
                    
                    document.getElementById('users').innerHTML = html;
                }
                
                // Load users when page loads
                loadUsers();
                
                // Auto refresh every 3 seconds
                setInterval(loadUsers, 3000);
            </script>
        </body>
        </html>
    `);
});

// 2. Add User Route
app.post('/add-user', async (req, res) => {
    try {
        console.log('📥 Received:', req.body);
        
        const { name, email, age } = req.body;
        
        // Validation
        if (!name || !email || !age) {
            return res.status(400).send('All fields required!');
        }
        
        // Create user
        const newUser = new User({
            name: name,
            email: email,
            age: Number(age)
        });
        
        // Save to database
        await newUser.save();
        console.log('✅ User added:', name);
        
        // Redirect back
        res.redirect('/');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
        res.status(500).send('Error: ' + error.message);
    }
});

// 3. Get Users Route
app.get('/get-users', async (req, res) => {
    try {
        const users = await User.find().sort({ _id: -1 });
        res.json(users);
    } catch (error) {
        res.json([]);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📝 Press Ctrl+C to stop\n`);
});