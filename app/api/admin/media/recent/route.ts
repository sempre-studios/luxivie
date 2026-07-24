import { NextRequest, NextResponse } from 'next/server'
import { isApiAuthenticated } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from('blog-images')
      .list('', {
        limit: 20,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('[media/recent] Supabase storage list error:', error)
      return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
    }

    const images = (data || [])
      .filter((item) => item.id !== null)
      .map((item) => {
        const { data: urlData } = supabaseAdmin.storage
          .from('blog-images')
          .getPublicUrl(item.name)
        return {
          url: urlData.publicUrl,
          name: item.name,
          created_at: item.created_at || '',
        }
      })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('[media/recent] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
