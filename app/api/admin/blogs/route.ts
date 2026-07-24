import { NextRequest, NextResponse } from 'next/server'
import { isApiAuthenticated } from '@/lib/admin-auth'
import { getAllBlogsForAdmin, createBlogPost, type BlogPostInput } from '@/lib/blogs'

export async function GET(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const posts = await getAllBlogsForAdmin()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('[admin/blogs] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const status = ['draft', 'published', 'scheduled'].includes(body.status)
      ? body.status
      : 'draft'
    const input: BlogPostInput = {
      title: body.title.trim(),
      slug: body.slug?.trim() || undefined,
      excerpt: body.excerpt?.trim() || undefined,
      content: body.content,
      image_url: body.image_url?.trim() || body.featured_image_url?.trim() || undefined,
      author: body.author?.trim() || undefined,
      category: body.category?.trim() || undefined,
      tags: Array.isArray(body.tags) ? body.tags : (typeof body.tags === 'string' ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      status: status as 'draft' | 'published' | 'scheduled',
      published_at: body.published_at || null,
      seo_title: body.seo_title?.trim() || undefined,
      seo_description: body.seo_description?.trim() || undefined,
      social_visibility: body.social_visibility || null,
    }

    const { post, error: createError } = await createBlogPost(input)

    if (!post) {
      return NextResponse.json({ error: createError || 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('[admin/blogs] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
