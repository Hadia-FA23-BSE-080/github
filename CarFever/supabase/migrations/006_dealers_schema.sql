-- 006_dealers_schema.sql
-- Step 1: Create dealers table
CREATE TABLE IF NOT EXISTS public.dealers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  logo_url text,
  license_number text,
  address text,
  city text,
  phone text,
  email text,
  website text,
  description text,
  business_hours jsonb,
  is_verified boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  rating_avg numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Add dealer_id to cars table
ALTER TABLE public.cars
ADD COLUMN dealer_id uuid REFERENCES public.dealers(id) ON DELETE SET NULL;

-- Step 3: Enable RLS and add policies
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;

-- Public can read approved dealers
CREATE POLICY "dealers_public_read"
  ON public.dealers FOR SELECT
  USING (status = 'approved');

-- Admin can read all dealers through service role bypass, no need for RLS subquery here
CREATE POLICY "dealers_user_read"
  ON public.dealers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own dealer profile
CREATE POLICY "dealers_user_insert"
  ON public.dealers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own dealer profile
CREATE POLICY "dealers_user_update"
  ON public.dealers FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger for dealers
CREATE TRIGGER update_dealers_modtime
  BEFORE UPDATE ON public.dealers
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
