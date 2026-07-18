-- Fix: Add status column to inquiries table
-- Run this in Supabase SQL Editor

ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'read', 'replied', 'archived'));

-- Update existing rows: if is_read = true, set status = 'read'
UPDATE public.inquiries SET status = 'read' WHERE is_read = true;
UPDATE public.inquiries SET status = 'pending' WHERE is_read = false;
