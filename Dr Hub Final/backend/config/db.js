const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create real pool
const realPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'doctor_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mock DB File Path
const mockDbPath = path.join(__dirname, 'mock_db.json');

// Initialize mock DB
function loadMockDb() {
  if (fs.existsSync(mockDbPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(mockDbPath, 'utf8'));
      if (!data.messages) data.messages = [];
      return data;
    } catch (e) {
      console.error('Error reading mock DB, resetting:', e);
    }
  }
  const defaultDb = {
    users: [
      {id: 1, name: "Dr. Sarah Ahmed", email: "sarah@doctorhub.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "doctor", phone: "03001234567"},
      {id: 2, name: "Dr. Bilal Khan", email: "bilal@doctorhub.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "doctor", phone: "03001234568"},
      {id: 3, name: "Hakeem Luqman Chishti", email: "luqman@doctorhub.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "doctor", phone: "03001234569"},
      {id: 4, name: "John Doe", email: "john@example.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "patient", phone: "03001234570"},
      {id: 5, name: "Jane Doe", email: "jane@example.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "patient", phone: "03001234571"},
      {id: 6, name: "Assistant Ali", email: "ali@doctorhub.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "assistant", phone: "03001234572"},
      {id: 7, name: "Admin User", email: "admin@doctorhub.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "admin", phone: "03001234573"},
      {id: 8, name: "Super Admin", email: "superadmin@doctorhub.com", password: "$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y", role: "superadmin", phone: "03001234574"}
    ],
    doctors: [
      {id: 1, user_id: 1, specialization: "Cardiologist", treatment_type: "allopathic", license_no: "LIC-123", experience_years: 12, fee: 2000, bio: "Experienced cardiologist."},
      {id: 2, user_id: 2, specialization: "Pediatrician", treatment_type: "homeopathic", license_no: "LIC-124", experience_years: 8, fee: 1500, bio: "Child specialist."},
      {id: 3, user_id: 3, specialization: "Herbalist", treatment_type: "herbal", license_no: "LIC-125", experience_years: 20, fee: 1000, bio: "Natural remedies expert."}
    ],
    patients: [
      {id: 1, user_id: 4, date_of_birth: "1990-01-01", blood_group: "O+", allergies: "Peanuts"},
      {id: 2, user_id: 5, date_of_birth: "1995-05-05", blood_group: "A-", allergies: "Dust"}
    ],
    clinics: [
      {id: 1, doctor_id: 1, name: "Heart Care Center", address: "123 Main St", city: "Karachi", timings_json: {"mon": "10:00-14:00", "wed": "10:00-14:00"}},
      {id: 2, doctor_id: 2, name: "Kids Cure", address: "456 Elm St", city: "Lahore", timings_json: {"tue": "15:00-18:00", "thu": "15:00-18:00"}},
      {id: 3, doctor_id: 3, name: "Natural Healing", address: "789 Oak St", city: "Islamabad", timings_json: {"fri": "16:00-20:00"}}
    ],
    appointments: [],
    payments: [],
    medical_history: [],
    prescriptions: [],
    assistants: [
      {id: 1, user_id: 6, doctor_id: 1}
    ],
    messages: []
  };
  fs.writeFileSync(mockDbPath, JSON.stringify(defaultDb, null, 2), 'utf8');
  return defaultDb;
}

const mockDb = loadMockDb();
function saveMockDb() {
  fs.writeFileSync(mockDbPath, JSON.stringify(mockDb, null, 2), 'utf8');
}

// Mock query runner
function runMockQuery(sql, params = []) {
  const cleanSql = sql.replace(/\s+/g, ' ').trim();
  console.log(`[MockDB Query] ${cleanSql} | Params:`, params);

  // 1. SELECT * FROM users WHERE email = ?
  if (cleanSql.includes('SELECT * FROM users WHERE email =')) {
    const email = params[0];
    const rows = mockDb.users.filter(u => u.email === email);
    return [rows];
  }

  // 2. SELECT id, name, email, role, phone FROM users WHERE id = ?
  if (cleanSql.includes('SELECT id, name, email, role, phone FROM users WHERE id =')) {
    const id = Number(params[0]);
    const rows = mockDb.users.filter(u => u.id === id).map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone
    }));
    return [rows];
  }

  // 2b. SELECT id, name, role FROM users WHERE role = "doctor" OR role = "assistant"
  if (cleanSql.includes('FROM users WHERE role = "doctor" OR role = "assistant"') || cleanSql.includes("role = 'doctor' OR role = 'assistant'")) {
    const rows = mockDb.users.filter(u => u.role === 'doctor' || u.role === 'assistant').map(u => ({
      id: u.id, name: u.name, role: u.role
    }));
    return [rows];
  }

  // Admin: SELECT all users
  if (cleanSql === 'SELECT id, name, email, role, phone FROM users ORDER BY id ASC') {
    const rows = mockDb.users.map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone
    }));
    return [rows];
  }

  // Admin: DELETE user
  if (cleanSql.startsWith('DELETE FROM users WHERE id =')) {
    const id = Number(params[0]);
    mockDb.users = mockDb.users.filter(u => u.id !== id);
    saveMockDb();
    return [{ affectedRows: 1 }];
  }

  // Admin: UPDATE user role
  if (cleanSql.startsWith('UPDATE users SET role = ? WHERE id = ?')) {
    const role = params[0];
    const id = Number(params[1]);
    const userIndex = mockDb.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockDb.users[userIndex].role = role;
      saveMockDb();
    }
    return [{ affectedRows: 1 }];
  }

  // Admin: UPDATE user password
  if (cleanSql.startsWith('UPDATE users SET password = ? WHERE id = ?')) {
    const password = params[0];
    const id = Number(params[1]);
    const userIndex = mockDb.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockDb.users[userIndex].password = password;
      saveMockDb();
    }
    return [{ affectedRows: 1 }];
  }

  // SuperAdmin: UPDATE doctor fee
  if (cleanSql.startsWith('UPDATE doctors SET fee = ? WHERE id = ?')) {
    const fee = Number(params[0]);
    const id = Number(params[1]);
    const doctorIndex = mockDb.doctors.findIndex(d => d.id === id);
    if (doctorIndex !== -1) {
      mockDb.doctors[doctorIndex].fee = fee;
      saveMockDb();
    }
    return [{ affectedRows: 1 }];
  }

  // 3. SELECT id FROM patients WHERE user_id = ?
  if (cleanSql.includes('SELECT id FROM patients WHERE user_id =')) {
    const userId = Number(params[0]);
    const rows = mockDb.patients.filter(p => p.user_id === userId).map(p => ({ id: p.id }));
    return [rows];
  }

  // 4. SELECT id FROM doctors WHERE user_id = ?
  if (cleanSql.includes('SELECT id FROM doctors WHERE user_id =')) {
    const userId = Number(params[0]);
    const rows = mockDb.doctors.filter(d => d.user_id === userId).map(d => ({ id: d.id }));
    return [rows];
  }

  // 5. INSERT INTO users ...
  if (cleanSql.startsWith('INSERT INTO users')) {
    const [name, email, password, role, phone] = params;
    const newId = mockDb.users.length > 0 ? Math.max(...mockDb.users.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, name, email, password, role, phone };
    mockDb.users.push(newUser);
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 6. INSERT INTO patients (user_id) VALUES (?)
  if (cleanSql.startsWith('INSERT INTO patients')) {
    const [userId] = params;
    const newId = mockDb.patients.length > 0 ? Math.max(...mockDb.patients.map(p => p.id)) + 1 : 1;
    mockDb.patients.push({ id: newId, user_id: Number(userId), date_of_birth: null, blood_group: null, allergies: null });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 7. INSERT INTO doctors ...
  if (cleanSql.startsWith('INSERT INTO doctors')) {
    const [userId, fee, treatment_type] = params;
    const newId = mockDb.doctors.length > 0 ? Math.max(...mockDb.doctors.map(d => d.id)) + 1 : 1;
    mockDb.doctors.push({
      id: newId,
      user_id: Number(userId),
      specialization: 'General',
      treatment_type: treatment_type || 'allopathic',
      license_no: '',
      experience_years: 0,
      fee: Number(fee || 0),
      bio: ''
    });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 8. INSERT INTO assistants (user_id, doctor_id) VALUES (?, ?)
  if (cleanSql.startsWith('INSERT INTO assistants')) {
    const [userId, doctorId] = params;
    const newId = mockDb.assistants.length > 0 ? Math.max(...mockDb.assistants.map(a => a.id)) + 1 : 1;
    mockDb.assistants.push({ id: newId, user_id: Number(userId), doctor_id: Number(doctorId) });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 9. SELECT d.id, u.name, d.specialization, d.treatment_type, d.experience_years, d.fee, d.bio, u.email, u.phone FROM doctors d JOIN users u ON d.user_id = u.id
  if (cleanSql.includes('FROM doctors d JOIN users u ON d.user_id = u.id')) {
    let rows = mockDb.doctors.map(d => {
      const u = mockDb.users.find(user => user.id === d.user_id) || {};
      return {
        id: d.id,
        name: u.name || 'Unknown',
        specialization: d.specialization,
        treatment_type: d.treatment_type,
        experience_years: d.experience_years,
        fee: d.fee,
        bio: d.bio,
        email: u.email,
        phone: u.phone
      };
    });

    if (cleanSql.includes('WHERE d.treatment_type = ?')) {
      const type = params[0];
      rows = rows.filter(r => r.treatment_type === type);
    }
    if (cleanSql.includes('WHERE d.id = ?')) {
      const id = Number(params[0]);
      rows = rows.filter(r => r.id === id);
    }
    return [rows];
  }

  // 10. SELECT * FROM clinics WHERE doctor_id = ?
  if (cleanSql.includes('SELECT * FROM clinics WHERE doctor_id =')) {
    const docId = Number(params[0]);
    const rows = mockDb.clinics.filter(c => c.doctor_id === docId);
    return [rows];
  }

  // 11. INSERT INTO appointments (patient_id, doctor_id, clinic_id, date, time_slot, status) VALUES (?, ?, ?, ?, ?, "pending")
  if (cleanSql.startsWith('INSERT INTO appointments')) {
    const [patient_id, doctor_id, clinic_id, date, time_slot] = params;
    const newId = mockDb.appointments.length > 0 ? Math.max(...mockDb.appointments.map(a => a.id)) + 1 : 1;
    mockDb.appointments.push({
      id: newId,
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      clinic_id: Number(clinic_id),
      date: date,
      time_slot: time_slot,
      status: 'pending',
      payment_status: 'pending'
    });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 12. SELECT a.*, u.name as doctor_name FROM appointments a JOIN doctors d ON a.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE a.patient_id = ? ORDER BY a.date DESC
  // 13. SELECT a.*, u.name as patient_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE a.doctor_id = ? ORDER BY a.date DESC
  // 14. SELECT a.*, u.name as patient_name, ud.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id JOIN doctors d ON a.doctor_id = d.id JOIN users ud ON d.user_id = ud.id ORDER BY a.date DESC
  // 15. SELECT a.* FROM appointments a ORDER BY a.date DESC
  if (cleanSql.includes('FROM appointments a')) {
    let rows = mockDb.appointments.map(a => {
      const doc = mockDb.doctors.find(d => d.id === a.doctor_id) || {};
      const docUser = mockDb.users.find(u => u.id === doc.user_id) || {};
      const pat = mockDb.patients.find(p => p.id === a.patient_id) || {};
      const patUser = mockDb.users.find(u => u.id === pat.user_id) || {};

      return {
        ...a,
        doctor_name: docUser.name || 'Unknown',
        patient_name: patUser.name || 'Unknown'
      };
    });

    if (cleanSql.includes('WHERE a.patient_id = ?')) {
      const pid = Number(params[0]);
      rows = rows.filter(r => r.patient_id === pid);
    } else if (cleanSql.includes('WHERE a.doctor_id = ?')) {
      const did = Number(params[0]);
      rows = rows.filter(r => r.doctor_id === did);
    }

    rows.sort((x, y) => new Date(y.date) - new Date(x.date));
    return [rows];
  }

  // 16. UPDATE appointments SET status = "completed" WHERE id = ?
  if (cleanSql.startsWith('UPDATE appointments SET status = "completed" WHERE id =')) {
    const id = Number(params[0]);
    const apt = mockDb.appointments.find(a => a.id === id);
    if (apt) apt.status = 'completed';
    saveMockDb();
    return [{}];
  }

  // UPDATE appointments SET status = "cancelled" WHERE id = ?
  if (cleanSql.startsWith('UPDATE appointments SET status = "cancelled" WHERE id =')) {
    const id = Number(params[0]);
    const apt = mockDb.appointments.find(a => a.id === id);
    if (apt) apt.status = 'cancelled';
    saveMockDb();
    return [{}];
  }

  // 17. UPDATE appointments SET payment_status = ? WHERE id = ?
  if (cleanSql.startsWith('UPDATE appointments SET payment_status = "pending" WHERE id =')) {
    const id = Number(params[0]);
    const apt = mockDb.appointments.find(a => a.id === id);
    if (apt) apt.payment_status = 'pending';
    saveMockDb();
    return [{}];
  }

  // 18. UPDATE appointments SET payment_status = ?, status = ? WHERE id = ?
  if (cleanSql.startsWith('UPDATE appointments SET payment_status = ?, status = ? WHERE id =')) {
    const [pStatus, status, id] = params;
    const apt = mockDb.appointments.find(a => a.id === Number(id));
    if (apt) {
      apt.payment_status = pStatus;
      apt.status = status;
    }
    saveMockDb();
    return [{}];
  }

  // 19. INSERT INTO payments (appointment_id, amount, screenshot_url, status) VALUES (?, ?, ?, "pending")
  if (cleanSql.startsWith('INSERT INTO payments (appointment_id, amount, screenshot_url, status)')) {
    const [appointment_id, amount, screenshot_url] = params;
    const newId = mockDb.payments.length > 0 ? Math.max(...mockDb.payments.map(p => p.id)) + 1 : 1;
    mockDb.payments.push({
      id: newId,
      appointment_id: Number(appointment_id),
      amount: Number(amount),
      screenshot_url: screenshot_url,
      status: 'pending',
      verified_by: null,
      verified_at: null
    });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 20. UPDATE payments SET status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?
  if (cleanSql.startsWith('UPDATE payments SET status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id =')) {
    const [status, verified_by, id] = params;
    const pay = mockDb.payments.find(p => p.id === Number(id));
    if (pay) {
      pay.status = status;
      pay.verified_by = Number(verified_by);
      pay.verified_at = new Date().toISOString();
    }
    saveMockDb();
    return [{}];
  }

  // 21. SELECT appointment_id FROM payments WHERE id = ?
  if (cleanSql.includes('SELECT appointment_id FROM payments WHERE id =')) {
    const id = Number(params[0]);
    const rows = mockDb.payments.filter(p => p.id === id).map(p => ({ appointment_id: p.appointment_id }));
    return [rows];
  }

  // 22. SELECT mh.*, u.name as doctor_name FROM medical_history mh JOIN doctors d ON mh.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE mh.patient_id = ? ORDER BY mh.created_at DESC
  if (cleanSql.includes('FROM medical_history mh')) {
    let rows = mockDb.medical_history.map(mh => {
      const doc = mockDb.doctors.find(d => d.id === mh.doctor_id) || {};
      const docUser = mockDb.users.find(u => u.id === doc.user_id) || {};
      return {
        ...mh,
        doctor_name: docUser.name || 'Unknown'
      };
    });
    if (cleanSql.includes('WHERE mh.patient_id = ?')) {
      const pid = Number(params[0]);
      rows = rows.filter(r => r.patient_id === pid);
    }
    rows.sort((x, y) => new Date(y.created_at) - new Date(x.created_at));
    return [rows];
  }

  // 23. SELECT * FROM prescriptions WHERE medical_history_id = ?
  if (cleanSql.includes('SELECT * FROM prescriptions WHERE medical_history_id =')) {
    const hid = Number(params[0]);
    const rows = mockDb.prescriptions.filter(p => p.medical_history_id === hid);
    return [rows];
  }

  // 24. INSERT INTO medical_history ...
  if (cleanSql.startsWith('INSERT INTO medical_history')) {
    const [patient_id, doctor_id, appointment_id, symptoms, diagnosis, notes] = params;
    const newId = mockDb.medical_history.length > 0 ? Math.max(...mockDb.medical_history.map(m => m.id)) + 1 : 1;
    mockDb.medical_history.push({
      id: newId,
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      appointment_id: appointment_id ? Number(appointment_id) : null,
      symptoms,
      diagnosis,
      notes,
      created_at: new Date().toISOString()
    });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 25. INSERT INTO prescriptions ...
  if (cleanSql.startsWith('INSERT INTO prescriptions')) {
    const [medical_history_id, medicine_name, dosage, duration, instructions] = params;
    const newId = mockDb.prescriptions.length > 0 ? Math.max(...mockDb.prescriptions.map(p => p.id)) + 1 : 1;
    mockDb.prescriptions.push({
      id: newId,
      medical_history_id: Number(medical_history_id),
      medicine_name,
      dosage,
      duration,
      instructions,
      created_at: new Date().toISOString()
    });
    saveMockDb();
    return [{ insertId: newId }];
  }

  // 26. SELECT messages ...
  if (cleanSql.includes('FROM messages m')) {
    const [uid1, uid2, uid3, uid4] = params; // (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
    const rows = mockDb.messages.filter(m => 
      (m.sender_id === uid1 && m.receiver_id === uid2) || 
      (m.sender_id === uid3 && m.receiver_id === uid4)
    ).map(m => {
      const sender = mockDb.users.find(u => u.id === m.sender_id) || {};
      const receiver = mockDb.users.find(u => u.id === m.receiver_id) || {};
      return {
        ...m,
        sender_name: sender.name || 'Unknown',
        receiver_name: receiver.name || 'Unknown'
      };
    });
    return [rows];
  }

  // 27. INSERT INTO messages ...
  if (cleanSql.startsWith('INSERT INTO messages')) {
    const [sender_id, receiver_id, message] = params;
    const newId = mockDb.messages.length > 0 ? Math.max(...mockDb.messages.map(m => m.id)) + 1 : 1;
    mockDb.messages.push({
      id: newId,
      sender_id: Number(sender_id),
      receiver_id: Number(receiver_id),
      message,
      created_at: new Date().toISOString()
    });
    saveMockDb();
    return [{ insertId: newId }];
  }

  console.log(`[MockDB Warning] Query not specifically matched: ${cleanSql}. Returning empty results.`);
  return [[]];
}

// Wrapper Pool Object
const pool = {
  async query(sql, params = []) {
    try {
      // Try real MySQL query
      const result = await realPool.query(sql, params);
      return result;
    } catch (err) {
      console.warn('MySQL Query failed, falling back to mock DB:', err.message);
      return runMockQuery(sql, params);
    }
  }
};

module.exports = pool;
