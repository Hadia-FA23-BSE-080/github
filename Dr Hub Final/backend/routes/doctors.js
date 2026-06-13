const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { treatment_type, city } = req.query;
    let query = `
      SELECT d.id, u.name, d.specialization, d.treatment_type, d.experience_years, d.fee, d.bio, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
    `;
    const params = [];
    
    if (treatment_type) {
      query += ` WHERE d.treatment_type = ?`;
      params.push(treatment_type);
    }
    
    const [doctors] = await pool.query(query, params);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [doctors] = await pool.query(`
      SELECT d.id, u.name, d.specialization, d.treatment_type, d.experience_years, d.fee, d.bio, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `, [req.params.id]);
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const [clinics] = await pool.query('SELECT * FROM clinics WHERE doctor_id = ?', [req.params.id]);
    res.json({ ...doctors[0], clinics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
