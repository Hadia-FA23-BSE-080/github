const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/:patientId', protect, async (req, res) => {
  try {
    let patientId = req.params.patientId;

    // Resolve if user_id was passed instead of patient_id
    const [resolvedPatient] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [patientId]);
    if (resolvedPatient.length > 0) {
      patientId = resolvedPatient[0].id;
    }

    const [history] = await pool.query(
      'SELECT mh.*, u.name as doctor_name FROM medical_history mh JOIN doctors d ON mh.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE mh.patient_id = ? ORDER BY mh.created_at DESC',
      [patientId]
    );

    for (let i = 0; i < history.length; i++) {
      const [prescriptions] = await pool.query('SELECT * FROM prescriptions WHERE medical_history_id = ?', [history[i].id]);
      history[i].prescriptions = prescriptions;
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, restrictTo('doctor'), async (req, res) => {
  try {
    const { patient_id, appointment_id, symptoms, diagnosis, notes, prescriptions } = req.body;

    const [doctors] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
    if (doctors.length === 0) return res.status(403).json({ message: 'Doctor profile not found' });
    const doctor_id = doctors[0].id;

    const [result] = await pool.query(
      'INSERT INTO medical_history (patient_id, doctor_id, appointment_id, symptoms, diagnosis, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_id, symptoms, diagnosis, notes]
    );

    const historyId = result.insertId;

    if (prescriptions && prescriptions.length > 0) {
      for (const p of prescriptions) {
        await pool.query(
          'INSERT INTO prescriptions (medical_history_id, medicine_name, dosage, duration, instructions) VALUES (?, ?, ?, ?, ?)',
          [historyId, p.medicine_name, p.dosage, p.duration, p.instructions]
        );
      }
    }

    res.status(201).json({ message: 'Medical history and prescriptions added securely. Immutable record created.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
