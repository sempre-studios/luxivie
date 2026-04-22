import { supabaseAdmin } from './supabase'

type SupabaseLikeError = {
  code?: string | null
  message?: string | null
  details?: string | null
}

function isExpectedDevConnectionError(error: SupabaseLikeError | null | undefined) {
  const message = `${error?.message || ''} ${error?.details || ''}`.toLowerCase()
  return message.includes('econnrefused') || message.includes('fetch failed')
}

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

function normalizeTags(tags: unknown): string[] | undefined {
  if (tags == null) return undefined
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t)).filter(Boolean)
  }
  return undefined
}

/**
 * Resolve tenant id: optional env UUID bypasses slug lookup (use when slug ≠ NEXT_PUBLIC_ORG_SLUG).
 */
function resolveBusinessIdFromEnv(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_BUSINESS_ID?.trim()
  if (!raw) return undefined
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuid.test(raw) ? raw : undefined
}

/**
 * Get all published blogs for a business
 */
export async function getPublishedBlogs(
  businessSlug?: string
): Promise<BlogPost[]> {
  try {
    const slug = (businessSlug || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie').trim()
    const envBusinessId = resolveBusinessIdFromEnv()

    let businessId: string

    if (envBusinessId) {
      businessId = envBusinessId
    } else {
      const { data: businessRow, error: businessError } = await supabaseAdmin
        .from('businesses')
        .select('id')
        .ilike('slug', slug)
        .limit(1)
        .maybeSingle()

      if (businessError || !businessRow?.id) {
        if (businessError && isExpectedDevConnectionError(businessError)) {
          console.warn(
            '[blogs] Supabase unreachable (check NEXT_PUBLIC_SUPABASE_URL; default localhost only works with `supabase start`). Optional: set NEXT_PUBLIC_BUSINESS_ID to your businesses.id UUID to skip slug lookup once the URL is correct.',
          )
        } else if (businessError) {
          console.error('Error fetching business:', businessError)
        }
        return []
      }
      businessId = businessRow.id
    }

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
      tags: normalizeTags(blog.tags),
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
    const businessSlugValue = (businessSlug || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie').trim()
    const envBusinessId = resolveBusinessIdFromEnv()

    let businessId: string

    if (envBusinessId) {
      businessId = envBusinessId
    } else {
      const { data: businessRow, error: businessError } = await supabaseAdmin
        .from('businesses')
        .select('id')
        .ilike('slug', businessSlugValue)
        .limit(1)
        .maybeSingle()

      if (businessError || !businessRow?.id) {
        if (businessError && !isExpectedDevConnectionError(businessError)) {
          console.error('Error fetching business:', businessError)
        }
        return null
      }
      businessId = businessRow.id
    }

    const { data: blog, error: blogError } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('business_id', businessId)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (blogError || !blog) {
      if (blogError && !isExpectedDevConnectionError(blogError)) {
        console.error('Error fetching blog:', blogError)
      }
      return null
    }

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
      tags: normalizeTags(blog.tags),
      updatedAt: blog.updated_at || undefined,
    }
  } catch (error) {
    console.error('Error in getBlogBySlug:', error)
    return null
  }
}
