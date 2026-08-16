-- Run this script in your Supabase SQL Editor

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending',
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert Mock Data (Run this only once)
INSERT INTO customers (first_name, last_name, email) VALUES
  ('Alice', 'Smith', 'alice@example.com'),
  ('Bob', 'Johnson', 'bob@example.com'),
  ('Charlie', 'Brown', 'charlie@example.com'),
  ('Diana', 'Prince', 'diana@example.com')
ON CONFLICT DO NOTHING;

-- Note: In a fresh DB, you can run these. If you run multiple times, you might get duplicate orders.
INSERT INTO orders (customer_id, product_name, total_amount, status) 
SELECT id, 'MacBook Pro 16"', 2499.99, 'Shipped' FROM customers WHERE first_name = 'Alice' LIMIT 1;
INSERT INTO orders (customer_id, product_name, total_amount, status) 
SELECT id, 'iPhone 15 Pro', 1099.00, 'Processing' FROM customers WHERE first_name = 'Alice' LIMIT 1;
INSERT INTO orders (customer_id, product_name, total_amount, status) 
SELECT id, 'Sony WH-1000XM5', 349.99, 'Delivered' FROM customers WHERE first_name = 'Bob' LIMIT 1;
INSERT INTO orders (customer_id, product_name, total_amount, status) 
SELECT id, 'Dell XPS 13', 1299.50, 'Pending' FROM customers WHERE first_name = 'Charlie' LIMIT 1;
INSERT INTO orders (customer_id, product_name, total_amount, status) 
SELECT id, 'iPad Air', 599.00, 'Shipped' FROM customers WHERE first_name = 'Diana' LIMIT 1;
INSERT INTO orders (customer_id, product_name, total_amount, status) 
SELECT id, 'Logitech MX Master 3', 99.99, 'Delivered' FROM customers WHERE first_name = 'Bob' LIMIT 1;

-- 4. Enable RLS (Row Level Security) and add policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to customers" ON customers;
CREATE POLICY "Allow public read access to customers" ON customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;
CREATE POLICY "Allow public read access to orders" ON orders FOR SELECT USING (true);

-- 5. Create a Database Function (RPC) for Full-Text Search with JOIN
-- This is true Advanced SQL using PostgreSQL's full-text search capabilities (to_tsvector and to_tsquery)
CREATE OR REPLACE FUNCTION search_orders_and_customers(search_term TEXT)
RETURNS TABLE (
  order_id UUID,
  product_name TEXT,
  total_amount DECIMAL,
  status TEXT,
  order_date TIMESTAMP WITH TIME ZONE,
  customer_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT
) AS $$
BEGIN
  IF search_term IS NULL OR search_term = '' THEN
    RETURN QUERY
    SELECT 
      o.id, o.product_name, o.total_amount, o.status, o.order_date,
      c.id, c.first_name, c.last_name, c.email
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.order_date DESC;
  ELSE
    RETURN QUERY
    SELECT 
      o.id, o.product_name, o.total_amount, o.status, o.order_date,
      c.id, c.first_name, c.last_name, c.email
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE 
      -- Create a tsvector dynamically for searching across multiple columns from both tables
      to_tsvector('english', coalesce(o.product_name, '') || ' ' || 
                             coalesce(o.status, '') || ' ' || 
                             coalesce(c.first_name, '') || ' ' || 
                             coalesce(c.last_name, '') || ' ' || 
                             coalesce(c.email, ''))
      -- Use websearch_to_tsquery for natural language search queries
      @@ websearch_to_tsquery('english', search_term)
    ORDER BY o.order_date DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;
