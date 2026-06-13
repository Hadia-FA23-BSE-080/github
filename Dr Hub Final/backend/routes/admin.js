const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Get all users (Admin/SuperAdmin)
router.get('/users', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, phone FROM users ORDER BY id ASC');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Delete user (SuperAdmin only)
router.delete('/users/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    // Cannot delete yourself
    if (req.user.id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

const bcrypt = require('bcrypt');

// Update user role
router.put('/users/:id/role', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
  try {
    const { role } = req.body;
    // SuperAdmin can give Admin role, but normal Admin cannot give SuperAdmin role
    if (role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating role' });
  }
});

// Reset password
router.put('/users/:id/password', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
    res.json({ message: 'User password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

// Update doctor fee (SuperAdmin only)
router.put('/doctors/:id/fee', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const { fee } = req.body;
    await pool.query('UPDATE doctors SET fee = ? WHERE id = ?', [fee, req.params.id]);
    res.json({ message: 'Doctor fee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating fee' });
  }
});

module.exports = router;
