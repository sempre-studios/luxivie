import { supabaseAdmin } from './supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  author?: string
  publishedAt: string
  readTime?: string
  category?: string
  tags?: string[]
  updatedAt?: string
}

/**
 * Get all published blogs for a business
 */
export async function getPublishedBlogs(
  businessSlug?: string
): Promise<BlogPost[]> {
  try {
    const slug = businessSlug || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie'
    
    // Get business by slug
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .single()

    if (businessError || !businesses) {
      console.error('Error fetching business:', businessError)
      return []
    }

    const businessId = businesses.id

    // Fetch published blogs for this business
    const { data: blogs, error: blogsError } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (blogsError) {
      console.error('Error fetching blogs:', blogsError)
      return []
    }

    // Transform to BlogPost format
    return (blogs || []).map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || undefined,
      content: blog.content,
      image_url: blog.image_url || undefined,
      author: blog.author || undefined,
      publishedAt: blog.published_at || blog.created_at,
      readTime: blog.read_time || undefined,
      category: blog.category || undefined,
      tags: blog.tags && Array.isArray(blog.tags) ? blog.tags : undefined,
      updatedAt: blog.updated_at || undefined,
    }))
  } catch (error) {
    console.error('Error in getPublishedBlogs:', error)
    return []
  }
}

/**
 * Get a single published blog by slug
 */
export async function getBlogBySlug(
  slug: string,
  businessSlug?: string
): Promise<BlogPost | null> {
  try {
    const businessSlugValue = businessSlug || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie'
    
    // Get business by slug
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('slug', businessSlugValue)
      .limit(1)
      .single()

    if (businessError || !businesses) {
      console.error('Error fetching business:', businessError)
      return null
    }

    const businessId = businesses.id

    // Fetch blog by slug for this business
    const { data: blog, error: blogError } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('business_id', businessId)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (blogError || !blog) {
      console.error('Error fetching blog:', blogError)
      return null
    }

    // Transform to BlogPost format
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || undefined,
      content: blog.content,
      image_url: blog.image_url || undefined,
      author: blog.author || undefined,
      publishedAt: blog.published_at || blog.created_at,
      readTime: blog.read_time || undefined,
      category: blog.category || undefined,
      tags: blog.tags && Array.isArray(blog.tags) ? blog.tags : undefined,
      updatedAt: blog.updated_at || undefined,
    }
  } catch (error) {
    console.error('Error in getBlogBySlug:', error)
    return null
  }
}

