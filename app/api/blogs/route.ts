import { NextRequest, NextResponse } from 'next/server'
import { getPublishedBlogs } from '@/lib/blogs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug =
      searchParams.get('businessSlug') || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie'

    const transformedBlogs = await getPublishedBlogs(businessSlug)

    return NextResponse.json(
      { blogs: transformedBlogs },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (error) {
    console.error('Error in GET /api/blogs:', error)
    return NextResponse.json({ blogs: [] }, { status: 200 })
  }
}
