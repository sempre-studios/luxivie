import { NextRequest, NextResponse } from 'next/server'
import { isApiAuthenticated } from '@/lib/admin-auth'
import { updateBlogPost, deleteBlogPost, type BlogPostInput } from '@/lib/blogs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = await params
    const body = await request.json()

    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const status = ['draft', 'published', 'scheduled'].includes(body.status)
      ? body.status
      : undefined
    const input: Partial<BlogPostInput> = {
      title: body.title.trim(),
      slug: body.slug?.trim() || undefined,
      excerpt: body.excerpt?.trim() || undefined,
      content: body.content,
      image_url: body.image_url?.trim() || body.featured_image_url?.trim() || undefined,
      author: body.author?.trim() || undefined,
      category: body.category?.trim() || undefined,
      tags: Array.isArray(body.tags) ? body.tags : (typeof body.tags === 'string' ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      status: status as 'draft' | 'published' | 'scheduled' | undefined,
      published_at: body.published_at || null,
      seo_title: body.seo_title?.trim() || undefined,
      seo_description: body.seo_description?.trim() || undefined,
      social_visibility: body.social_visibility || null,
    }

    const post = await updateBlogPost(slug, input)

    if (!post) {
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('[admin/blogs/[slug]] PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = await params
    const ok = await deleteBlogPost(slug)

    if (!ok) {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[admin/blogs/[slug]] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
