import { supabaseAdmin } from './supabase'
import { type BlogPost, createBlogPost, getAllBlogsForAdmin } from './blogs'
import { signHandoff } from './operator-handoff'
import crypto from 'crypto'

export interface OperatorPost {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  category: string | null
  tags: string[] | null
  status: 'draft' | 'scheduled' | 'published'
  scheduled_at: string | null
  published_at: string | null
  updated_at: string
  version: string
  preview_url: string | null
  editor_handoff: string | null
}

interface BlogRow {
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

const idempotencyStore = new Map<string, { result: unknown; exp: number }>()

function cleanupIdempotency(): void {
  const now = Date.now()
  for (const [key, value] of idempotencyStore.entries()) {
    if (value.exp < now) {
      idempotencyStore.delete(key)
    }
  }
}

function getIdempotency(key: string): unknown | null {
  cleanupIdempotency()
  const record = idempotencyStore.get(key)
  return record ? record.result : null
}

function setIdempotency(key: string, result: unknown, ttlMinutes = 10): void {
  idempotencyStore.set(key, { result, exp: Date.now() + ttlMinutes * 60 * 1000 })
}

function rowToBlogPost(row: BlogRow): BlogPost {
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

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
}

function previewUrl(slug: string): string {
  return `${baseUrl()}/blog/${slug}`
}

function editorHandoffUrl(slug: string): string | null {
  try {
    return signHandoff(slug, 'edit')
  } catch {
    return null
  }
}

function toOperatorDto(post: BlogPost, opts?: { preview?: boolean; handoff?: boolean; detail?: boolean }): OperatorPost {
  const updatedAt = post.updatedAt || new Date().toISOString()

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || null,
    content: opts?.detail ? (post.content || null) : null,
    category: post.category || null,
    tags: post.tags || null,
    status: post.status,
    scheduled_at: post.publishedAt || null,
    published_at: post.publishedAt || null,
    updated_at: updatedAt,
    version: updatedAt,
    preview_url: opts?.preview ? previewUrl(post.slug) : null,
    editor_handoff: opts?.handoff ? (editorHandoffUrl(post.slug) ?? null) : null,
  }
}

function deriveStatus(publishedAt?: string | null): 'draft' | 'scheduled' | 'published' {
  if (!publishedAt) return 'draft'
  const time = new Date(publishedAt).getTime()
  if (time <= Date.now()) return 'published'
  return 'scheduled'
}

function validateInput(input: Record<string, unknown>): void {
  const title = input.title as string | undefined
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new Error('Title is required')
  }
  if (title.length > 120) {
    throw new Error('Title exceeds maximum length')
  }

  const content = input.content as string | undefined
  if (content !== undefined) {
    if (typeof content !== 'string' || content.length > 2000) {
      throw new Error('Content exceeds maximum length')
    }
  }

  const excerpt = input.excerpt as string | undefined
  if (excerpt !== undefined && (typeof excerpt !== 'string' || excerpt.length > 300)) {
    throw new Error('Excerpt exceeds maximum length')
  }

  const tags = input.tags as string[] | undefined
  if (tags !== undefined && !Array.isArray(tags)) {
    throw new Error('Tags must be an array')
  }
}

export async function listBlogsForOperator(): Promise<OperatorPost[]> {
  const posts = await getAllBlogsForAdmin()
  return posts.map((post) => toOperatorDto(post))
}

export async function getBlogByIdForOperator(id: string): Promise<OperatorPost | null> {
  const { data, error } = await supabaseAdmin.from('blogs').select('*').eq('id', id).single()
  if (error || !data) {
    return null
  }

  const post = rowToBlogPost(data as BlogRow)
  return toOperatorDto(post, { handoff: true, detail: true })
}

export async function getPreviewForOperator(id: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.from('blogs').select('slug').eq('id', id).single()
  if (error || !data) {
    return null
  }

  return previewUrl((data as { slug: string }).slug)
}

export async function getEditorHandoffForOperator(id: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.from('blogs').select('slug').eq('id', id).single()
  if (error || !data) {
    return null
  }

  return editorHandoffUrl((data as { slug: string }).slug)
}

export async function createBlogPostForOperator(input: Record<string, unknown>, idempotencyKey: string): Promise<OperatorPost> {
  const cached = getIdempotency(idempotencyKey)
  if (cached) {
    return cached as OperatorPost
  }

  validateInput(input)

  const title = (input.title as string).trim()
  const content = typeof input.content === 'string' ? input.content : ''
  const excerpt = typeof input.excerpt === 'string' ? input.excerpt.trim() : undefined
  const category = typeof input.category === 'string' ? input.category.trim() : undefined
  const tags = Array.isArray(input.tags) ? input.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean) : undefined
  const scheduledAt = typeof input.scheduled_at === 'string' ? input.scheduled_at : undefined

  const { post, error } = await createBlogPost({
    title,
    content,
    excerpt,
    category,
    tags,
    status: scheduledAt ? 'scheduled' : 'draft',
    published_at: scheduledAt || null,
  })

  if (!post || error) {
    throw new Error(error || 'Failed to create post')
  }

  const result = toOperatorDto(post, { handoff: true })
  setIdempotency(idempotencyKey, result)

  return result
}

async function getRawPostById(id: string): Promise<BlogRow | null> {
  const { data, error } = await supabaseAdmin.from('blogs').select('*').eq('id', id).single()
  if (error || !data) {
    return null
  }
  return data as BlogRow
}

export async function editBlogPostForOperator(
  id: string,
  input: Record<string, unknown>,
  expectedVersion: string,
  idempotencyKey: string,
): Promise<OperatorPost | { conflict: true; post: OperatorPost }> {
  const cached = getIdempotency(idempotencyKey)
  if (cached) {
    return cached as OperatorPost
  }

  validateInput(input)

  const row = await getRawPostById(id)
  if (!row) {
    throw new Error('Post not found')
  }

  if (row.updated_at !== expectedVersion) {
    return { conflict: true, post: toOperatorDto(rowToBlogPost(row), { handoff: true }) }
  }

  const payload: Record<string, unknown> = {}
  if (input.title !== undefined) payload.title = (input.title as string).trim()
  if (input.excerpt !== undefined) payload.excerpt = (input.excerpt as string).trim() || null
  if (input.content !== undefined) payload.content = input.content as string
  if (input.category !== undefined) payload.category = typeof input.category === 'string' ? input.category.trim() || null : null
  if (input.tags !== undefined) {
    payload.tags = Array.isArray(input.tags)
      ? input.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean)
      : []
  }

  const { data, error } = await supabaseAdmin.from('blogs').update(payload).eq('id', id).select().single()
  if (error || !data) {
    throw new Error(error?.message || 'Failed to update post')
  }

  const result = toOperatorDto(rowToBlogPost(data as BlogRow), { handoff: true })
  setIdempotency(idempotencyKey, result)

  return result
}

export async function scheduleBlogPostForOperator(
  id: string,
  scheduledAt: string,
  expectedVersion: string,
  idempotencyKey: string,
): Promise<OperatorPost | { conflict: true; post: OperatorPost }> {
  const cached = getIdempotency(idempotencyKey)
  if (cached) {
    return cached as OperatorPost
  }

  const row = await getRawPostById(id)
  if (!row) {
    throw new Error('Post not found')
  }

  if (row.updated_at !== expectedVersion) {
    return { conflict: true, post: toOperatorDto(rowToBlogPost(row), { handoff: true }) }
  }

  const status = deriveStatus(scheduledAt)
  const { data, error } = await supabaseAdmin.from('blogs').update({ published_at: scheduledAt, status }).eq('id', id).select().single()
  if (error || !data) {
    throw new Error(error?.message || 'Failed to schedule post')
  }

  const result = toOperatorDto(rowToBlogPost(data as BlogRow), { handoff: true })
  setIdempotency(idempotencyKey, result)

  return result
}

export async function getPostAnalyticsForOperator(): Promise<{ total: number; draft: number; scheduled: number; published: number }> {
  const { data, error } = await supabaseAdmin.from('blogs').select('status')
  if (error || !data) {
    throw new Error(error?.message || 'Failed to load analytics')
  }

  const counts = { total: data.length, draft: 0, scheduled: 0, published: 0 }
  for (const row of data as { status: string }[]) {
    if (counts[row.status as keyof typeof counts] !== undefined) {
      counts[row.status as keyof typeof counts]++
    }
  }

  return counts
}
