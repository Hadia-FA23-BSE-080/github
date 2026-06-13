const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload-screenshot', protect, restrictTo('patient'), upload.single('screenshot'), async (req, res) => {
  try {
    const { appointment_id, amount } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const screenshot_url = `/uploads/${file.filename}`;

    const [result] = await pool.query(
      'INSERT INTO payments (appointment_id, amount, screenshot_url, status) VALUES (?, ?, ?, "pending")',
      [appointment_id, amount, screenshot_url]
    );

    await pool.query('UPDATE appointments SET payment_status = "pending" WHERE id = ?', [appointment_id]);

    res.status(201).json({ message: 'Screenshot uploaded', paymentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/verify', protect, restrictTo('assistant', 'admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    
    await pool.query(
      'UPDATE payments SET status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.user.id, req.params.id]
    );

    const [payment] = await pool.query('SELECT appointment_id FROM payments WHERE id = ?', [req.params.id]);
    if (payment.length > 0) {
      const appStatus = status === 'verified' ? 'confirmed' : 'pending';
      await pool.query('UPDATE appointments SET payment_status = ?, status = ? WHERE id = ?', [status, appStatus, payment[0].appointment_id]);
    }

    res.json({ message: `Payment ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/verify-by-appointment/:appointmentId', protect, restrictTo('assistant', 'admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.body;
    const { appointmentId } = req.params;
    
    await pool.query(
      'UPDATE payments SET status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE appointment_id = ?',
      [status, req.user.id, appointmentId]
    );

    const appStatus = status === 'verified' ? 'confirmed' : 'pending';
    await pool.query(
      'UPDATE appointments SET payment_status = ?, status = ? WHERE id = ?',
      [status, appStatus, appointmentId]
    );

    res.json({ message: `Payment verified for appointment ${appointmentId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
