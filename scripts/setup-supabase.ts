/**
 * Setup script — creates the `blogs` table and `blog-images` storage bucket
 * in Supabase using the REST API (no DB password needed).
 *
 * Usage:
 *   npx tsx scripts/setup-supabase.ts
 *
 * Requires env vars in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function executeSql(sql: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${supabaseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey as string,
      'Authorization': `Bearer ${supabaseKey as string}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!res.ok) {
    const text = await res.text()
    return { success: false, error: `HTTP ${res.status}: ${text}` }
  }

  const data = await res.json()
  if (data.error) {
    return { success: false, error: data.error }
  }

  return { success: true }
}

const SQL_STATEMENTS: { label: string; sql: string }[] = [
  { label: 'Drop old blog_posts table', sql: 'DROP TABLE IF EXISTS blog_posts CASCADE;' },
  { label: 'Create blogs table', sql: `CREATE TABLE IF NOT EXISTS blogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    excerpt text,
    content text NOT NULL DEFAULT '',
    featured_image_url text,
    author text,
    category text,
    tags text[] DEFAULT '{}',
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );` },
  { label: 'Create index', sql: 'CREATE INDEX IF NOT EXISTS idx_blogs_status_published_at ON blogs (status, published_at DESC);' },
  { label: 'Create update trigger function', sql: `CREATE OR REPLACE FUNCTION update_blogs_updated_at()
   RETURNS trigger AS $$
   BEGIN
     NEW.updated_at = now();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;` },
  { label: 'Drop old trigger', sql: 'DROP TRIGGER IF EXISTS blogs_updated_at ON blogs;' },
  { label: 'Create trigger', sql: `CREATE TRIGGER blogs_updated_at
   BEFORE UPDATE ON blogs
   FOR EACH ROW
   EXECUTE FUNCTION update_blogs_updated_at();` },
]

async function run() {
  console.log('=== Luxivie Supabase Setup ===\n')

  // Step 1: Create blogs table via /pg/query endpoint
  console.log('1. Creating blogs table...')
  let sqlSuccess = true

  for (const { label, sql } of SQL_STATEMENTS) {
    const result = await executeSql(sql)
    if (result.success) {
      console.log(`   ✓ ${label}`)
    } else {
      console.error(`   ✗ ${label}: ${result.error}`)
      sqlSuccess = false
    }
  }

  if (!sqlSuccess) {
    console.error('\n   Some SQL statements failed.')
    console.error('   Please run supabase/migrations/002_create_blogs.sql manually in the Supabase SQL Editor.')
  }

  // Step 2: Create storage bucket
  console.log('\n2. Creating blog-images storage bucket...')
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('   Error listing buckets:', listError.message)
  } else {
    const exists = buckets?.some((b) => b.name === 'blog-images')
    if (exists) {
      console.log('   ✓ blog-images bucket already exists.')
    } else {
      const { error: createError } = await supabase.storage.createBucket('blog-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
        fileSizeLimit: '5MB',
      })

      if (createError) {
        console.error('   ✗ Error creating bucket:', createError.message)
      } else {
        console.log('   ✓ blog-images bucket created successfully.')
      }
    }
  }

  // Step 3: Verify
  console.log('\n3. Verifying setup...')
  const { error: tableError } = await supabase
    .from('blogs')
    .select('id')
    .limit(1)

  if (tableError) {
    console.error('   ✗ blogs table check failed:', tableError.message)
  } else {
    console.log('   ✓ blogs table is accessible.')
  }

  const { error: storageError } = await supabase.storage.from('blog-images').list('', { limit: 1 })
  if (storageError) {
    console.error('   ✗ blog-images bucket check failed:', storageError.message)
  } else {
    console.log('   ✓ blog-images bucket is accessible.')
  }

  console.log('\n=== Setup complete ===')
  process.exit(0)
}

run().catch((err) => {
  console.error('Setup failed:', err)
  process.exit(1)
})
