-- =============================================================================
-- Car Fever — Core Tables Migration (Step 1)
-- Run this in Supabase SQL Editor AFTER 002_admin_tables.sql
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS (app-level profiles; can be linked to auth.users later)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid UNIQUE,
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  phone         text,
  role          text NOT NULL DEFAULT 'buyer'
                CHECK (role IN ('buyer', 'seller', 'admin', 'content_manager', 'inspection_manager')),
  status        text NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'suspended', 'pending')),
  avatar_url    text,
  bio           text,
  listings_count int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  last_login    timestamptz
);

-- =============================================================================
-- CARS (single source of truth for all listings)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.cars (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  brand            text NOT NULL,
  model            text NOT NULL,
  year             int  NOT NULL CHECK (year >= 1900 AND year <= 2100),
  price            bigint NOT NULL DEFAULT 0,
  price_display    text,
  mileage          int,
  transmission     text DEFAULT 'Automatic',
  fuel_type        text DEFAULT 'Petrol',
  body_type        text DEFAULT 'Sedan',
  exterior_color   text,
  interior_color   text,
  engine           text,
  horsepower       int,
  condition        text,
  city             text,
  location         text,
  description      text,
  images           jsonb NOT NULL DEFAULT '[]'::jsonb,
  features         jsonb NOT NULL DEFAULT '[]'::jsonb,
  badge            text,
  rating           numeric(3,1),
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'rejected', 'draft')),
  is_featured      boolean NOT NULL DEFAULT false,
  views_count      int NOT NULL DEFAULT 0,
  slug             text UNIQUE,
  meta_title       text,
  meta_description text,
  seller_id        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  seller_name      text,
  seller_email     text,
  seller_phone     text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  published_at     timestamptz
);

-- =============================================================================
-- INQUIRIES (contact seller / make offer / general)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  subject    text NOT NULL,
  message    text NOT NULL,
  car_id     uuid REFERENCES public.cars(id) ON DELETE SET NULL,
  status     text NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- INSPECTIONS (booking requests)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.inspections (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make                text NOT NULL,
  model               text NOT NULL,
  year                int NOT NULL CHECK (year >= 1900 AND year <= 2100),
  registration_number text NOT NULL,
  address             text NOT NULL,
  plan                text NOT NULL DEFAULT 'standard'
                      CHECK (plan IN ('basic', 'standard', 'premium')),
  plan_price          int NOT NULL DEFAULT 0,
  scheduled_date      date NOT NULL,
  time_slot           text NOT NULL,
  customer_name       text NOT NULL,
  customer_phone      text NOT NULL,
  customer_email      text,
  status              text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  car_id              uuid REFERENCES public.cars(id) ON DELETE SET NULL,
  user_id             uuid REFERENCES public.users(id) ON DELETE SET NULL,
  inspector_id        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  report_url          text,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_cars_status          ON public.cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_brand           ON public.cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_created_at      ON public.cars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_is_featured     ON public.cars(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_inquiries_status     ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_is_read    ON public.inquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_car_id     ON public.inquiries(car_id);

CREATE INDEX IF NOT EXISTS idx_inspections_status        ON public.inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_scheduled_date ON public.inspections(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at    ON public.inspections(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON public.users(role);

-- =============================================================================
-- UPDATED_AT TRIGGERS (reuses function from 002 if present)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_modtime ON public.users;
CREATE TRIGGER update_users_modtime
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_cars_modtime ON public.cars;
CREATE TRIGGER update_cars_modtime
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_inquiries_modtime ON public.inquiries;
CREATE TRIGGER update_inquiries_modtime
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_inspections_modtime ON public.inspections;
CREATE TRIGGER update_inspections_modtime
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Sync is_read when status changes on inquiries
CREATE OR REPLACE FUNCTION public.sync_inquiry_read_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('read', 'replied', 'archived') THEN
    NEW.is_read := true;
  ELSIF NEW.status = 'pending' THEN
    NEW.is_read := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_inquiry_read ON public.inquiries;
CREATE TRIGGER sync_inquiry_read
  BEFORE INSERT OR UPDATE OF status ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.sync_inquiry_read_status();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- ----- USERS -----
DROP POLICY IF EXISTS "users_public_read_active" ON public.users;
CREATE POLICY "users_public_read_active"
  ON public.users FOR SELECT
  USING (status = 'active');

-- ----- CARS -----
DROP POLICY IF EXISTS "cars_public_read_approved" ON public.cars;
CREATE POLICY "cars_public_read_approved"
  ON public.cars FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "cars_public_insert_pending" ON public.cars;
CREATE POLICY "cars_public_insert_pending"
  ON public.cars FOR INSERT
  WITH CHECK (status = 'pending');

-- ----- INQUIRIES -----
DROP POLICY IF EXISTS "inquiries_public_insert" ON public.inquiries;
CREATE POLICY "inquiries_public_insert"
  ON public.inquiries FOR INSERT
  WITH CHECK (status = 'pending' AND is_read = false);

-- ----- INSPECTIONS -----
DROP POLICY IF EXISTS "inspections_public_insert" ON public.inspections;
CREATE POLICY "inspections_public_insert"
  ON public.inspections FOR INSERT
  WITH CHECK (status = 'pending');

-- =============================================================================
-- STORAGE: car-images bucket (for Step 2 image uploads)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "car_images_public_read" ON storage.objects;
CREATE POLICY "car_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-images');

DROP POLICY IF EXISTS "car_images_public_upload" ON storage.objects;
CREATE POLICY "car_images_public_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'car-images');

DROP POLICY IF EXISTS "car_images_public_update" ON storage.objects;
CREATE POLICY "car_images_public_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'car-images');

DROP POLICY IF EXISTS "car_images_public_delete" ON storage.objects;
CREATE POLICY "car_images_public_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'car-images');

-- =============================================================================
-- REALTIME (for Step 3 admin notifications)
-- =============================================================================
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.cars;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inspections;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- OPTIONAL: Seed admin user record (update email to match your admin login)
-- =============================================================================
-- INSERT INTO public.users (name, email, role, status)
-- VALUES ('Admin User', 'admin@carfever.com', 'admin', 'active')
-- ON CONFLICT (email) DO NOTHING;
