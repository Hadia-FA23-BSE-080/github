-- ============================================
-- Day 04: Supabase & SQL
-- Task: Create a users table and insert 5 dummy records
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create the users table
CREATE TABLE users (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        UNIQUE NOT NULL,
  age         INT         NOT NULL,
  city        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Insert 5 dummy records
INSERT INTO users (name, email, age, city) VALUES
  ('Aarav Sharma',   'aarav.sharma@example.com',   25, 'Mumbai'),
  ('Priya Patel',    'priya.patel@example.com',    28, 'Delhi'),
  ('Rohan Verma',    'rohan.verma@example.com',    22, 'Bangalore'),
  ('Sneha Gupta',    'sneha.gupta@example.com',    30, 'Pune'),
  ('Vikram Singh',   'vikram.singh@example.com',   27, 'Jaipur');

-- Step 3: Verify — fetch all records
SELECT * FROM users;
