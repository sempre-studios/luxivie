/**
 * Migration — checks and applies schema changes for blog editor enhancements.
 *
 * Usage:
 *   npx tsx scripts/migrate-social-settings.ts
 *
 * Uses the same Supabase credentials as the app (service role key).
 * Checks current schema via the REST API, then attempts DDL via
 * the /pg/query endpoint. If DDL can't be run automatically, prints
 * the exact SQL to paste into the Supabase SQL Editor.
 *
 * Requires env vars in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function getBlogColumns(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', 'blogs')
    .eq('table_schema', 'public')

  if (error) {
    console.error('Error checking blogs columns:', error.message)
    return new Set()
  }

  return new Set((data || []).map((r: { column_name: string }) => r.column_name))
}

async function checkTableExists(tableName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_name', tableName)
    .eq('table_schema', 'public')

  if (error) return false
  return (data || []).length > 0
}

async function tryExecuteSql(sql: string): Promise<boolean> {
  // Try the /pg/query endpoint (works on some Supabase instances)
  try {
    const res = await fetch(`${supabaseUrl}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey!,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    })
    if (res.ok) {
      const data = await res.json()
      if (!data.error) return true
    }
  } catch {}

  return false
}

const ALL_SQL = `-- Migration: Social settings, SEO fields, and social visibility

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

-- 2. Social visibility per article
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS social_visibility jsonb DEFAULT NULL;

-- 3. SEO fields
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_description text;

-- 4. Read time field
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS read_time text;

-- 5. Image URL column (rename from featured_image_url if needed)
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_url text;
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

-- 6. Update status constraint to include 'scheduled'
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blogs_status_check') THEN
    ALTER TABLE blogs DROP CONSTRAINT blogs_status_check;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
ALTER TABLE blogs ADD CONSTRAINT blogs_status_check
  CHECK (status IN ('draft', 'published', 'scheduled'));`

async function run() {
  console.log('=== Luxivie Migration: Social Settings & SEO Fields ===\n')
  console.log(`Project: ${supabaseUrl}\n`)

  // Step 1: Check current schema
  console.log('1. Checking current schema...\n')

  const blogColumns = await getBlogColumns()
  const businessSettingsExists = await checkTableExists('business_settings')

  if (blogColumns.size > 0) {
    console.log(`   blogs columns: ${[...blogColumns].join(', ')}`)
  } else {
    console.log('   blogs columns: (could not read — table may not exist)')
  }
  console.log(`   business_settings table: ${businessSettingsExists ? 'exists' : 'missing'}\n`)

  // Determine what's missing
  const requiredColumns = ['social_visibility', 'seo_title', 'seo_description', 'read_time', 'image_url']
  const missingColumns = requiredColumns.filter((c) => !blogColumns.has(c))
  const needBusinessSettings = !businessSettingsExists

  if (missingColumns.length === 0 && !needBusinessSettings) {
    console.log('✓ All schema changes are already applied. Nothing to migrate.\n')
    process.exit(0)
  }

  console.log('2. Missing schema changes:')
  if (needBusinessSettings) console.log('   • business_settings table')
  for (const col of missingColumns) console.log(`   • blogs.${col}`)
  console.log('   • status constraint (ensure scheduled is allowed)\n')

  // Step 2: Try to execute SQL automatically
  console.log('3. Attempting automatic migration via /pg/query...\n')

  const autoSuccess = await tryExecuteSql(ALL_SQL)

  if (autoSuccess) {
    console.log('   ✓ Migration applied automatically!\n')

    // Verify
    const newColumns = await getBlogColumns()
    const newMissing = requiredColumns.filter((c) => !newColumns.has(c))
    if (newMissing.length === 0) {
      console.log('   ✓ Verified: all columns present.\n')
    } else {
      console.log(`   ⚠ Could not verify: still missing ${newMissing.join(', ')}\n`)
    }
    process.exit(0)
  }

  // Step 3: Can't execute automatically — output SQL
  console.log('   ✗ Could not execute SQL automatically.\n')
  console.log('   The /pg/query endpoint is not available on this Supabase instance.\n')
  console.log('3. Manual migration required.\n')
  console.log('   Go to: Supabase Dashboard → SQL Editor → New query')
  console.log('   Paste the SQL below and click Run:\n')
  console.log('─'.repeat(70))
  console.log(ALL_SQL)
  console.log('─'.repeat(70))
  console.log('\n   Or run the migration file from the project:')
  console.log('   cat supabase/migrations/004_social_settings.sql | pbcopy')
  console.log('   (then paste into Supabase SQL Editor)\n')

  process.exit(1)
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
