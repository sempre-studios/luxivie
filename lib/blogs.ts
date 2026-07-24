import { supabaseAdmin } from './supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  author?: string
  status: 'draft' | 'published' | 'scheduled'
  publishedAt?: string
  readTime?: string
  category?: string
  tags?: string[]
  updatedAt?: string
  seoTitle?: string
  seoDescription?: string
  socialVisibility?: Record<string, boolean>
}

export interface BlogPostInput {
  title: string
  slug?: string
  excerpt?: string
  content: string
  image_url?: string
  author?: string
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'scheduled'
  published_at?: string | null
  seo_title?: string
  seo_description?: string
  social_visibility?: Record<string, boolean> | null
}

interface BlogPostRow {
  id: string
  business_id: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string
  image_url: string | null
  author: string | null
  category: string | null
  tags: string[] | null
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  read_time: string | null
  seo_title: string | null
  seo_description: string | null
  social_visibility: Record<string, boolean> | null
  created_at: string
  updated_at: string
}

function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || undefined,
    content: row.content || '',
    image_url: row.image_url || undefined,
    author: row.author || undefined,
    status: row.status,
    publishedAt: row.published_at || undefined,
    readTime: row.read_time || undefined,
    category: row.category || undefined,
    tags: row.tags || undefined,
    updatedAt: row.updated_at,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    socialVisibility: row.social_visibility || undefined,
  }
}

function deriveStatusAndPublishedAt(
  status: BlogPostInput['status'],
  published_at?: string | null
): { status: 'draft' | 'published' | 'scheduled'; published_at: string | null } {
  let effectiveStatus = status || 'draft'
  let date = published_at || null

  if (effectiveStatus === 'published') {
    if (!date) date = new Date().toISOString()
    if (new Date(date) > new Date()) effectiveStatus = 'scheduled'
  }

  if (effectiveStatus === 'scheduled' && date && new Date(date) <= new Date()) {
    effectiveStatus = 'published'
  }

  return { status: effectiveStatus, published_at: date }
}

function normalizeCategory(category?: string | null): string | null {
  const c = category?.trim()
  return c || null
}

function normalizeTags(tags?: string[] | null): string[] {
  if (!tags) return []
  const trimmed = tags.map((t) => t.trim()).filter(Boolean)
  const lower = trimmed.map((t) => t.toLowerCase())
  return [...new Set(lower)]
}

function estimateReadTime(html: string): string {
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = plain ? plain.split(' ').length : 0
  return `${Math.max(3, Math.ceil(words / 220))} Min Read`
}

/**
 * Get all published blogs from Supabase
 */
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .in('status', ['published', 'scheduled'])
      .lte('published_at', now)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('[blogs] Supabase error:', error)
      return []
    }

    return (data as BlogPostRow[]).map(rowToBlogPost)
  } catch (error) {
    console.error('Error in getPublishedBlogs:', error)
    return []
  }
}

/**
 * Get a single published blog by slug from Supabase
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .in('status', ['published', 'scheduled'])
      .or(`published_at.lte.${now},published_at.is.null`)
      .single()

    if (error || !data) {
      return null
    }

    const post = rowToBlogPost(data as BlogPostRow)
    if (post.status === 'scheduled' && post.publishedAt && new Date(post.publishedAt) > new Date()) {
      return null
    }
    post.readTime = estimateReadTime(post.content)
    return post
  } catch (error) {
    console.error('Error in getBlogBySlug:', error)
    return null
  }
}

/**
 * Get all blogs for admin (including drafts)
 */
export async function getAllBlogsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[blogs] Supabase error:', error)
    return []
  }

  return (data as BlogPostRow[]).map(rowToBlogPost)
}

/**
 * Get a single blog by slug for admin (including drafts)
 */
export async function getBlogBySlugForAdmin(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return rowToBlogPost(data as BlogPostRow)
}

/**
 * Generate a unique slug from a title
 */
export async function generateUniqueSlug(title: string, ignoreSlug?: string): Promise<string> {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'post'

  let slug = base
  let counter = 1

  while (true) {
    if (slug === ignoreSlug) break
    const { data } = await supabaseAdmin
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .limit(1)

    if (!data || data.length === 0) break
    slug = `${base}-${counter++}`
  }

  return slug
}

/**
 * Create a new blog post
 */
export async function createBlogPost(input: BlogPostInput): Promise<{ post: BlogPost | null; error?: string }> {
  const slug = input.slug?.trim() || await generateUniqueSlug(input.title)

  const payload: Record<string, unknown> = {
    business_id: process.env.SUPABASE_BUSINESS_ID || '7fca71ec-1a2f-406b-906f-5154356620af',
    title: input.title,
    slug,
    excerpt: input.excerpt || null,
    content: input.content || '',
    image_url: input.image_url || null,
    author: input.author || null,
    category: normalizeCategory(input.category),
    tags: normalizeTags(input.tags),
    ...deriveStatusAndPublishedAt(input.status, input.published_at),
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    social_visibility: input.social_visibility || null,
  }

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[blogs] Create error:', error)
    return { post: null, error: error.message }
  }

  return { post: rowToBlogPost(data as BlogPostRow) }
}

/**
 * Update an existing blog post by slug
 */
export async function updateBlogPost(slug: string, input: Partial<BlogPostInput>): Promise<BlogPost | null> {
  const payload: Record<string, unknown> = {}

  if (input.title !== undefined) payload.title = input.title
  if (input.slug !== undefined && input.slug.trim()) {
    payload.slug = input.slug.trim()
  } else if (input.title !== undefined) {
    payload.slug = await generateUniqueSlug(input.title, slug)
  }
  if (input.excerpt !== undefined) payload.excerpt = input.excerpt || null
  if (input.content !== undefined) payload.content = input.content || ''
  if (input.image_url !== undefined) payload.image_url = input.image_url || null
  if (input.author !== undefined) payload.author = input.author || null
  if (input.category !== undefined) payload.category = normalizeCategory(input.category)
  if (input.tags !== undefined) payload.tags = normalizeTags(input.tags)
  if (input.status !== undefined || input.published_at !== undefined) {
    const meta = deriveStatusAndPublishedAt(input.status, input.published_at)
    payload.status = meta.status
    payload.published_at = meta.published_at
  }

  if (input.seo_title !== undefined) payload.seo_title = input.seo_title || null
  if (input.seo_description !== undefined) payload.seo_description = input.seo_description || null
  if (input.social_visibility !== undefined) payload.social_visibility = input.social_visibility || null

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .update(payload)
    .eq('slug', slug)
    .select()
    .single()

  if (error) {
    console.error('[blogs] Update error:', error)
    return null
  }

  return rowToBlogPost(data as BlogPostRow)
}

/**
 * Delete a blog post by slug
 */
export async function deleteBlogPost(slug: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('blogs')
    .delete()
    .eq('slug', slug)

  if (error) {
    console.error('[blogs] Delete error:', error)
    return false
  }

  return true
}

/**
 * Get existing categories from blog posts
 */
export async function getExistingCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('category')

    if (error) {
      console.error('[blogs] getExistingCategories error:', error)
      return []
    }

    const categories = (data || [])
      .map((row) => row.category)
      .filter((c): c is string => Boolean(c))
      .map((c) => c.trim())
      .filter(Boolean)

    return [...new Set(categories)].sort()
  } catch (error) {
    console.error('Error in getExistingCategories:', error)
    return []
  }
}

/**
 * Get existing tags from blog posts
 */
export async function getExistingTags(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('tags')

    if (error) {
      console.error('[blogs] getExistingTags error:', error)
      return []
    }

    const tags = new Set<string>()
    for (const row of data || []) {
      if (Array.isArray(row.tags)) {
        for (const tag of row.tags) {
          if (typeof tag === 'string' && tag.trim()) {
            tags.add(tag.trim().toLowerCase())
          }
        }
      }
    }

    return [...tags].sort()
  } catch (error) {
    console.error('Error in getExistingTags:', error)
    return []
  }
}
