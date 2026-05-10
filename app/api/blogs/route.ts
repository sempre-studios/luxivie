import { NextResponse } from 'next/server'
import { getPublishedBlogs } from '@/lib/blogs'

export async function GET() {
  try {
    const transformedBlogs = await getPublishedBlogs()

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
