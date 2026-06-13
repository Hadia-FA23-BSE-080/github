const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('patient'), async (req, res) => {
  try {
    const { doctor_id, clinic_id, date, time_slot } = req.body;
    
    const [patients] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
    if (patients.length === 0) return res.status(404).json({ message: 'Patient profile not found' });
    const patient_id = patients[0].id;

    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, clinic_id, date, time_slot, status) VALUES (?, ?, ?, ?, ?, "pending")',
      [patient_id, doctor_id, clinic_id, date, time_slot]
    );

    res.status(201).json({ message: 'Appointment booked', appointmentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let query = '';
    let params = [];
    
    if (req.user.role === 'patient') {
      const [patients] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      if (patients.length === 0) return res.json([]);
      query = `SELECT a.*, u.name as doctor_name FROM appointments a JOIN doctors d ON a.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE a.patient_id = ? ORDER BY a.date DESC`;
      params = [patients[0].id];
    } else if (req.user.role === 'doctor') {
      const [doctors] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
      if (doctors.length === 0) return res.json([]);
      query = `SELECT a.*, u.name as patient_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE a.doctor_id = ? ORDER BY a.date DESC`;
      params = [doctors[0].id];
    } else if (req.user.role === 'assistant' || req.user.role === 'admin' || req.user.role === 'superadmin') {
      // Return all for admin and assistant
      query = `SELECT a.*, u.name as patient_name, ud.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id JOIN doctors d ON a.doctor_id = d.id JOIN users ud ON d.user_id = ud.id ORDER BY a.date DESC`;
    } else {
      query = `SELECT a.* FROM appointments a ORDER BY a.date DESC`;
    }

    const [appointments] = await pool.query(query, params);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/complete', protect, restrictTo('doctor'), async (req, res) => {
  try {
    await pool.query('UPDATE appointments SET status = "completed" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Appointment completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/cancel', protect, restrictTo('admin', 'superadmin', 'patient', 'assistant'), async (req, res) => {
  try {
    await pool.query('UPDATE appointments SET status = "cancelled" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
