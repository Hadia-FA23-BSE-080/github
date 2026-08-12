-- =============================================
-- CloudVault - Supabase Storage Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- Step 1: Create the storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('file-uploads', 'file-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Storage Policies (RLS)

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read/list their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
