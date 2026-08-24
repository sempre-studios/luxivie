/**
 * One-time migration script: copies published posts from client-cms
 * for the Luxivie website into the Supabase blog_posts table.
 *
 * Usage:
 *   npx tsx scripts/migrate-cms-blogs.ts
 *
 * Requires env vars:
 *   CLIENT_CMS_API_URL   – e.g. http://127.0.0.1:8000
 *   CLIENT_CMS_SITE_CODE – must be 07882df1-c703-47dd-bf69-3bf2da1b0584
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { config as loadEnv } from 'dotenv'

// Load local env vars (e.g. .env.local) before reading process.env
loadEnv({ path: '.env.local' })

const LUXIVIE_SITE_CODE = '07882df1-c703-47dd-bf69-3bf2da1b0584'

interface CmsPost {
  id: number | string
  title: string
  slug: string
  body: string | null
  meta_description: string | null
  status: string
  publish_at: string | null
  created_at: string
  updated_at: string
}

async function main() {
  const apiUrl = process.env.CLIENT_CMS_API_URL?.trim()
  const siteCode = process.env.CLIENT_CMS_SITE_CODE?.trim()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!apiUrl || !siteCode || !supabaseUrl || !serviceRoleKey) {
    console.error('Missing required env vars. Check .env.local')
    process.exit(1)
  }

  if (siteCode !== LUXIVIE_SITE_CODE) {
    console.error(`CLIENT_CMS_SITE_CODE must be ${LUXIVIE_SITE_CODE} (Luxivie). Got: ${siteCode}`)
    console.error('Aborting to avoid migrating posts from the wrong website.')
    process.exit(1)
  }

  console.log(`Fetching posts from ${apiUrl}/api/v1/websites/${siteCode}/posts ...`)

  const response = await fetch(`${apiUrl}/api/v1/websites/${siteCode}/posts`, {
    headers: {
      'X-API-Key': siteCode,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.error(`API returned ${response.status} ${response.statusText}`)
    process.exit(1)
  }

  const data = await response.json()
  const allPosts: CmsPost[] = data.data || []
  const published = allPosts.filter((p) => p.status === 'published')

  console.log(`Found ${allPosts.length} total posts, ${published.length} published.`)

  if (published.length === 0) {
    console.log('No published posts to migrate.')
    process.exit(0)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let inserted = 0
  let skipped = 0

  for (const post of published) {
    let slug = post.slug
    let counter = 1

    // Check for existing slug
    while (true) {
      const { data: existing } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', slug)
        .limit(1)

      if (!existing || existing.length === 0) break
      console.log(`  Slug "${slug}" already exists, trying "${slug}-${counter}"...`)
      slug = `${post.slug}-${counter++}`
    }

    const row = {
      title: post.title,
      slug,
      excerpt: post.meta_description || null,
      content: post.body || '',
      featured_image_url: null,
      author: null,
      category: null,
      tags: [],
      status: 'published' as const,
      published_at: post.publish_at || post.created_at,
    }

    const { error } = await supabase.from('blogs').insert(row)

    if (error) {
      console.error(`  Failed to insert "${post.title}":`, error.message)
      skipped++
    } else {
      console.log(`  Inserted: "${post.title}" → /${slug}`)
      inserted++
    }
  }

  console.log(`\nMigration complete: ${inserted} inserted, ${skipped} skipped.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
