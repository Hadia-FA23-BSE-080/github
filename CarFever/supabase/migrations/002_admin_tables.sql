-- Migration to create tables for blogs, categories, and seo_settings

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  featured_image text,
  author_id uuid, -- Should be foreign key to users/profiles in real app
  category_id uuid REFERENCES categories(id),
  tags jsonb DEFAULT '[]'::jsonb,
  status text CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft',
  published_at timestamp with time zone,
  meta_title text,
  meta_description text,
  focus_keyword text,
  views_count int DEFAULT 0,
  allow_comments boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- SEO Settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text UNIQUE NOT NULL,
  meta_title text,
  meta_description text,
  og_image text,
  canonical_url text,
  schema_markup jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

-- Add triggers to auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_modtime 
BEFORE UPDATE ON categories 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_blogs_modtime 
BEFORE UPDATE ON blogs 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_seo_settings_modtime 
BEFORE UPDATE ON seo_settings 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
