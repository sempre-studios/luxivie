-- Create storage bucket for blog images
-- Run this in the Supabase SQL Editor for project kvirwlcodrpwnwzvfcqr

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authenticated/service_role to upload
CREATE POLICY "Allow uploads to blog-images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images');

-- Allow authenticated/service_role to delete
CREATE POLICY "Allow deletes from blog-images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images');
