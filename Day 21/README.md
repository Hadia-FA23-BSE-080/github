# CloudVault - File Sharing App 📁

A premium file sharing application built with **React + Vite + Supabase**.

## Features

- 🔐 **Authentication** - Sign up / Sign in with email & password
- 📤 **File Upload** - Drag & drop or click to upload (multiple files supported)
- 📋 **File Listing** - Grid / List view with search and sort
- 📥 **File Download** - Download any uploaded file
- 🔗 **Share Links** - Generate signed URLs (1 hour expiry)
- 🗑️ **Delete** - Single or bulk delete files
- 📊 **Storage Info** - Track your storage usage
- 🎨 **Premium UI** - Dark theme, glassmorphism, animations

## Supabase Setup

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Create Storage Bucket
Go to **Storage** in your Supabase dashboard and create a new bucket:
- **Name**: `file-uploads`
- **Public**: No (private bucket)

### 3. Set Storage Policies
In the `file-uploads` bucket, add the following RLS policies:

**Allow authenticated users to upload files to their own folder:**
```sql
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'file-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
```

**Allow users to read their own files:**
```sql
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'file-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
```

**Allow users to delete their own files:**
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'file-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### 4. Update Environment Variables
Update the `.env` file with your Supabase project credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Running the App

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:5173

## Tech Stack
- React 19
- Vite 8
- Supabase (Auth + Storage)
- React Icons
- React Hot Toast

