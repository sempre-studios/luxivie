-- Migration: Social settings, SEO fields, and social visibility
-- Run via: npx tsx scripts/migrate-social-settings.ts

-- 1. Business settings table for social links
CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id)
);

CREATE INDEX IF NOT EXISTS idx_business_settings_business_id
  ON business_settings (business_id);

-- Enable RLS (service role key bypasses it, so admin API still works)
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- 2. Social visibility per article
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS social_visibility jsonb DEFAULT NULL;

-- 3. SEO fields
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_description text;

-- 4. Read time field
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS read_time text;

-- 5. Update status constraint to include 'scheduled'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blogs_status_check'
  ) THEN
    ALTER TABLE blogs DROP CONSTRAINT blogs_status_check;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE blogs ADD CONSTRAINT blogs_status_check
  CHECK (status IN ('draft', 'published', 'scheduled'));

-- 6. Rename featured_image_url to image_url if it hasn't been renamed yet
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'featured_image_url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE blogs RENAME COLUMN featured_image_url TO image_url;
  END IF;
END $$;
