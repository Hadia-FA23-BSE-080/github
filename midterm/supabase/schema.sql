-- AdFlow Pro Database Schema (PostgreSQL) - Updated for Frontend Compatibility

-- 1. Create Users Table
CREATE TABLE public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'moderator', 'admin')),
  plan TEXT DEFAULT 'None',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Ads Table
CREATE TABLE public.ads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Purchases Table (History)
CREATE TABLE public.purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- OPTIONAL: Insert Default Admin User for Testing
INSERT INTO public.users (id, email, password, role, plan)
VALUES ('admin-id-123', 'admin@adflow.com', 'admin123', 'admin', 'Premium');
