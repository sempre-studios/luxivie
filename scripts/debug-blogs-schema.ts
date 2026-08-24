/**
 * Debug script — prints the columns of the `blogs` table
 * Usage: npx tsx scripts/debug-blogs-schema.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function run() {
  // Try inserting a dummy row to see what columns are expected
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error querying blogs:', error.message)
  } else {
    if (data && data.length > 0) {
      console.log('Existing columns:', Object.keys(data[0]))
      console.log('Sample row:', JSON.stringify(data[0], null, 2))
    } else {
      console.log('Table is empty. Trying to infer columns from insert error...')

      // Try inserting with all expected columns to see which ones are missing
      const { error: insertError } = await supabase
        .from('blogs')
        .insert({
          title: 'test',
          slug: 'test-debug-' + Date.now(),
          excerpt: null,
          content: '',
          featured_image_url: null,
          author: null,
          category: null,
          tags: [],
          status: 'draft',
          published_at: null,
        })

      if (insertError) {
        console.error('Insert error:', insertError.message)

        // Clean up if it partially worked
        await supabase.from('blogs').delete().eq('slug', 'test-debug-' + Date.now())
      } else {
        console.log('Insert succeeded! All columns exist.')
        // Clean up
        await supabase.from('blogs').delete().eq('slug', 'test-debug-' + Date.now())
        console.log('Cleaned up test row.')
      }
    }
  }

  process.exit(0)
}

run().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
