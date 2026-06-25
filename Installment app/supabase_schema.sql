-- Supabase Database Schema for Installment E-Commerce Web Application
-- This SQL script sets up tables, types, relations, indexes, RLS policies, and utility triggers.

-- ==========================================
-- 1. DROP EXISTING CONSTRAINTS / TRIGGERS (safe - skips if table doesn't exist)
-- ==========================================
DO $$ BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trigger_approved_application ON public.installment_applications;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trigger_new_payment ON public.payments;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trigger_new_profile_audit ON public.profiles;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- ==========================================
-- 2. CUSTOM TYPES
-- ==========================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'customer', 'guarantor');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'additional_documents');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partially_paid', 'late', 'overdue');
  END IF;
END $$;

-- ==========================================
-- 3. TABLES CREATION
-- ==========================================

-- Profiles Table (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  cnic TEXT UNIQUE,
  cnic_front_url TEXT,
  cnic_back_url TEXT,
  selfie_url TEXT,
  utility_bill_url TEXT,
  salary_slip_url TEXT,
  bank_statement_url TEXT,
  is_blacklisted BOOLEAN DEFAULT false,
  manual_verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  cash_price NUMERIC(12, 2),
  installment_price NUMERIC(12, 2),
  category TEXT,
  images TEXT[] DEFAULT '{}',
  stock INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Installment Applications Table
CREATE TABLE IF NOT EXISTS public.installment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  status application_status DEFAULT 'pending' NOT NULL,
  installments_count INT DEFAULT 6 NOT NULL, -- 3, 6, 9, 12, 18, 24
  markup_percent NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
  down_payment NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  late_fee_percent NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
  total_payable NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  repayment_schedule JSONB DEFAULT '[]'::jsonb NOT NULL, -- list of scheduled dates & installment amounts
  employment_details JSONB, -- {company, occupation, salary, etc.}
  financial_details JSONB, -- {bank_name, account_no, monthly_expenses, etc.}
  device_details JSONB, -- {ip, user_agent, fingerprint, etc.}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Guarantors Table (Linked to applications)
CREATE TABLE IF NOT EXISTS public.guarantors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.installment_applications(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  cnic TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  occupation TEXT,
  monthly_income NUMERIC(12, 2),
  bank_info JSONB,
  cnic_front_url TEXT,
  cnic_back_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.installment_applications(id) ON DELETE RESTRICT NOT NULL,
  installment_index INT NOT NULL, -- index of the installment in the schedule (0, 1, 2, etc.)
  amount_paid NUMERIC(12, 2) NOT NULL,
  due_amount NUMERIC(12, 2) NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  payment_method TEXT, -- 'cash', 'bank_transfer', 'easypaisa', 'jazzcash'
  receipt_url TEXT,
  status payment_status DEFAULT 'paid' NOT NULL,
  late_fee_paid NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Customer Inquiries Table (from landing page)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  reply_content TEXT,
  replied_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'replied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- Announcements & Banners Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'news' NOT NULL, -- 'news', 'banner', 'offer'
  image_url TEXT,
  action_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audit Logs Table (Admin activity tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'approve_app', 'reject_app', 'update_product', etc.
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blacklist Table (Admins only)
CREATE TABLE IF NOT EXISTS public.blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnic TEXT UNIQUE,
  phone TEXT UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Documents Table (Users upload details)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function to check if the current user is an admin without causing recursion.
-- Declared as SECURITY DEFINER so that it executes with the database owner's privileges,
-- which bypasses RLS checks on the profiles table and prevents infinite loops.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guarantors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 4.2 Products RLS Policies
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admins write products" ON public.products;

CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins write products" ON public.products
  FOR ALL USING (public.is_admin());

-- 4.3 Installment Applications RLS Policies
DROP POLICY IF EXISTS "Customers can view own applications" ON public.installment_applications;
DROP POLICY IF EXISTS "Customers can insert own applications" ON public.installment_applications;
DROP POLICY IF EXISTS "Admins have full access to applications" ON public.installment_applications;

CREATE POLICY "Customers can view own applications" ON public.installment_applications
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert own applications" ON public.installment_applications
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins have full access to applications" ON public.installment_applications
  FOR ALL USING (public.is_admin());

-- 4.4 Guarantor RLS Policies
DROP POLICY IF EXISTS "Customers can view/add guarantor for their applications" ON public.guarantors;
DROP POLICY IF EXISTS "Admins have full access to guarantors" ON public.guarantors;

CREATE POLICY "Customers can view/add guarantor for their applications" ON public.guarantors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.installment_applications app
      WHERE app.id = application_id AND app.customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins have full access to guarantors" ON public.guarantors
  FOR ALL USING (public.is_admin());

-- 4.5 Payments RLS Policies
DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;

CREATE POLICY "Customers can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.installment_applications app
      WHERE app.id = application_id AND app.customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins have full access to payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- 4.6 Messages RLS Policies
DROP POLICY IF EXISTS "Sender/receiver read messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Admins read all messages" ON public.messages;

CREATE POLICY "Sender/receiver read messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Admins read all messages" ON public.messages
  FOR SELECT USING (public.is_admin());

-- 4.7 Inquiries RLS Policies
DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins read/write inquiries" ON public.inquiries;

CREATE POLICY "Public insert inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read/write inquiries" ON public.inquiries
  FOR ALL USING (public.is_admin());

-- 4.8 Announcements RLS Policies
DROP POLICY IF EXISTS "Public read active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins write announcements" ON public.announcements;

CREATE POLICY "Public read active announcements" ON public.announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins write announcements" ON public.announcements
  FOR ALL USING (public.is_admin());

-- 4.9 Audit Logs RLS Policies
DROP POLICY IF EXISTS "Admins only access audit logs" ON public.audit_logs;

CREATE POLICY "Admins only access audit logs" ON public.audit_logs
  FOR ALL USING (public.is_admin());

-- 4.10 Blacklist RLS Policies
DROP POLICY IF EXISTS "Admins only access blacklist" ON public.blacklist;

CREATE POLICY "Admins only access blacklist" ON public.blacklist
  FOR ALL USING (public.is_admin());

-- 4.11 Documents RLS Policies
DROP POLICY IF EXISTS "Customers can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Customers can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Admins have full access to documents" ON public.documents;

CREATE POLICY "Customers can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins have full access to documents" ON public.documents
  FOR ALL USING (public.is_admin());


-- ==========================================
-- 5. DATABASE FUNCTIONS
-- ==========================================

-- 5.1 Calculate Installment Schedule
CREATE OR REPLACE FUNCTION public.calculate_installment_schedule(app_id UUID)
RETURNS VOID AS $$
DECLARE
  app_rec RECORD;
  monthly_amt NUMERIC;
  schedule_json JSONB := '[]'::jsonb;
  due_date DATE;
  i INT;
BEGIN
  -- Fetch application details
  SELECT * INTO app_rec FROM public.installment_applications WHERE id = app_id;
  
  IF app_rec IS NOT NULL AND app_rec.status = 'approved' THEN
    monthly_amt := ROUND(app_rec.total_payable / app_rec.installments_count);
    
    FOR i IN 1..app_rec.installments_count LOOP
      due_date := (CURRENT_DATE + (i || ' month')::INTERVAL)::DATE;
      schedule_json := schedule_json || jsonb_build_object(
        'dueDate', due_date::TEXT,
        'amount', monthly_amt,
        'status', 'pending'
      );
    END LOOP;
    
    UPDATE public.installment_applications
    SET repayment_schedule = schedule_json,
        updated_at = timezone('utc'::text, now())
    WHERE id = app_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.2 Check Blacklist Status
CREATE OR REPLACE FUNCTION public.check_blacklist(p_cnic TEXT, p_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.blacklist
    WHERE (cnic IS NOT NULL AND cnic = p_cnic) OR (phone IS NOT NULL AND phone = p_phone)
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE ((cnic IS NOT NULL AND cnic = p_cnic) OR (phone IS NOT NULL AND phone = p_phone)) AND is_blacklisted = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.3 Update Application Status with Audit Logging
CREATE OR REPLACE FUNCTION public.update_application_status(app_id UUID, new_status application_status)
RETURNS VOID AS $$
BEGIN
  UPDATE public.installment_applications
  SET status = new_status,
      updated_at = timezone('utc'::text, now())
  WHERE id = app_id;
  
  -- Insert audit log
  INSERT INTO public.audit_logs (admin_id, action, details)
  VALUES (
    auth.uid(),
    'update_application_status',
    jsonb_build_object('application_id', app_id::TEXT, 'new_status', new_status::TEXT)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.4 Get Dashboard Metrics for Admins
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS JSONB AS $$
DECLARE
  total_customers INT;
  pending_requests INT;
  overdue_customers INT;
  total_collections NUMERIC;
BEGIN
  SELECT COUNT(*) INTO total_customers FROM public.profiles WHERE role = 'customer';
  SELECT COUNT(*) INTO pending_requests FROM public.installment_applications WHERE status = 'pending';
  
  -- Overdue customers: count distinct customers with approved applications having late schedule items
  SELECT COUNT(DISTINCT customer_id) INTO overdue_customers 
  FROM public.installment_applications 
  WHERE status = 'approved' AND repayment_schedule @> '[{"status": "late"}]';
  
  SELECT COALESCE(SUM(amount_paid), 0) INTO total_collections FROM public.payments;
  
  RETURN jsonb_build_object(
    'total_customers', total_customers,
    'pending_requests', pending_requests,
    'overdue_customers', overdue_customers,
    'total_collections', total_collections
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 6. AUTOMATED TRIGGERS
-- ==========================================

-- 6.1 Handle new user profile and automatically insert it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  err_msg TEXT;
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, cnic, role, is_blacklisted, manual_verification_status)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', ''), 
      new.email, 
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'cnic',
      COALESCE(new.raw_user_meta_data->>'role', 'customer')::public.user_role,
      false,
      'pending'
    );
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT;
    RAISE EXCEPTION 'TRIGGER_ERROR: %', err_msg;
  END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6.2 Trigger on application status changes/insert to approved -> calculate schedule
CREATE OR REPLACE FUNCTION public.handle_approved_application()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS NULL OR OLD.status <> 'approved')) THEN
    PERFORM public.calculate_installment_schedule(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_approved_application
  AFTER INSERT OR UPDATE ON public.installment_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_approved_application();

-- 6.3 Trigger on new payments to automatically update repayment schedule status
CREATE OR REPLACE FUNCTION public.handle_new_payment()
RETURNS TRIGGER AS $$
DECLARE
  app_rec RECORD;
  schedule JSONB;
  item JSONB;
  updated_schedule JSONB := '[]'::jsonb;
  i INT := 0;
BEGIN
  SELECT * INTO app_rec FROM public.installment_applications WHERE id = NEW.application_id;
  
  IF app_rec IS NOT NULL THEN
    schedule := app_rec.repayment_schedule;
    
    FOR item IN SELECT * FROM jsonb_array_elements(schedule) LOOP
      IF i = NEW.installment_index THEN
        item := jsonb_set(item, '{status}', '"paid"'::jsonb);
        item := jsonb_set(item, '{paidAmount}', to_jsonb(NEW.amount_paid));
        item := jsonb_set(item, '{paidDate}', to_jsonb(NEW.paid_at::text));
      END IF;
      updated_schedule := updated_schedule || item;
      i := i + 1;
    END LOOP;
    
    UPDATE public.installment_applications
    SET repayment_schedule = updated_schedule,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.application_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_new_payment
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_payment();

-- 6.4 Trigger on profile creation to log audit entry
CREATE OR REPLACE FUNCTION public.handle_new_profile_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (admin_id, action, details)
  VALUES (
    NULL,
    'profile_created',
    jsonb_build_object('profile_id', NEW.id::TEXT, 'role', NEW.role::TEXT, 'full_name', NEW.full_name)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_new_profile_audit
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_audit();
