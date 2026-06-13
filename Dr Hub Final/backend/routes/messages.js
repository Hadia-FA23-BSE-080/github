const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Get chat history between current user and other user
router.get('/:otherUserId', protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = Number(req.params.otherUserId);

    const [messages] = await pool.query(
      `SELECT m.*, sender.name as sender_name, receiver.name as receiver_name 
       FROM messages m 
       JOIN users sender ON m.sender_id = sender.id 
       JOIN users receiver ON m.receiver_id = receiver.id 
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) 
       ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId, otherUserId, currentUserId]
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message to another user
router.post('/', protect, async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id, message } = req.body;

    if (!message || !receiver_id) {
      return res.status(400).json({ message: 'Receiver and message content are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, Number(receiver_id), message]
    );

    res.status(201).json({
      id: result.insertId,
      sender_id,
      receiver_id: Number(receiver_id),
      message,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
