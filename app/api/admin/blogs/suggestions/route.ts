import { NextRequest, NextResponse } from 'next/server'
import { isApiAuthenticated } from '@/lib/admin-auth'
import { getExistingCategories, getExistingTags } from '@/lib/blogs'

export async function GET(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [categories, tags] = await Promise.all([
      getExistingCategories(),
      getExistingTags(),
    ])

    return NextResponse.json({ categories, tags })
  } catch (error) {
    console.error('[admin/blogs/suggestions] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
