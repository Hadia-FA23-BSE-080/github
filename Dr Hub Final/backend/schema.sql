CREATE DATABASE IF NOT EXISTS doctor_hub;
USE doctor_hub;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'assistant', 'admin', 'superadmin') NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  specialization VARCHAR(100),
  treatment_type ENUM('allopathic', 'homeopathic', 'herbal') NOT NULL,
  license_no VARCHAR(100),
  experience_years INT,
  fee DECIMAL(10, 2) NOT NULL,
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE,
  blood_group VARCHAR(10),
  allergies TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clinics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  timings_json JSON,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  clinic_id INT NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  screenshot_url TEXT NOT NULL,
  verified_by INT,
  verified_at TIMESTAMP NULL,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS medical_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  symptoms TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medical_history_id INT NOT NULL,
  medicine_name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medical_history_id) REFERENCES medical_history(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assistants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_id INT NOT NULL,
  permissions_json JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Seed Data (3 sample doctors, 2 patients, 1 assistant)
INSERT INTO users (name, email, password, role, phone) VALUES
('Dr. Sarah Ahmed', 'sarah@doctorhub.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'doctor', '03001234567'),
('Dr. Bilal Khan', 'bilal@doctorhub.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'doctor', '03001234568'),
('Hakeem Luqman Chishti', 'luqman@doctorhub.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'doctor', '03001234569'),
('John Doe', 'john@example.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'patient', '03001234570'),
('Jane Doe', 'jane@example.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'patient', '03001234571'),
('Assistant Ali', 'ali@doctorhub.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'assistant', '03001234572'),
('Admin User', 'admin@doctorhub.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'admin', '03001234573'),
('Super Admin', 'superadmin@doctorhub.com', '$2b$10$fJ/A1lJ43nL5/wB1B4N1M.9.m6.S55S3eO608Y52N0Bv0D1rV0y', 'superadmin', '03001234574');

INSERT INTO doctors (user_id, specialization, treatment_type, license_no, experience_years, fee, bio) VALUES
(1, 'Cardiologist', 'allopathic', 'LIC-123', 12, 2000, 'Experienced cardiologist.'),
(2, 'Pediatrician', 'homeopathic', 'LIC-124', 8, 1500, 'Child specialist.'),
(3, 'Herbalist', 'herbal', 'LIC-125', 20, 1000, 'Natural remedies expert.');

INSERT INTO patients (user_id, date_of_birth, blood_group) VALUES
(4, '1990-01-01', 'O+'),
(5, '1995-05-05', 'A-');

INSERT INTO clinics (doctor_id, name, address, city, timings_json) VALUES
(1, 'Heart Care Center', '123 Main St', 'Karachi', '{"mon": "10:00-14:00", "wed": "10:00-14:00"}'),
(2, 'Kids Cure', '456 Elm St', 'Lahore', '{"tue": "15:00-18:00", "thu": "15:00-18:00"}'),
(3, 'Natural Healing', '789 Oak St', 'Islamabad', '{"fri": "16:00-20:00"}');

INSERT INTO assistants (user_id, doctor_id) VALUES
(6, 1);
