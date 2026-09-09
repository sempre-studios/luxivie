'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { BlogDeleteButton } from './BlogDeleteButton'
import type { BlogPost } from '@/lib/blogs'

interface AdminBlogsListProps {
  posts: BlogPost[]
}

function formatDate(dateString?: string) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getLastAnchor(widget: HTMLElement): HTMLAnchorElement | null {
  const anchors = widget.querySelectorAll('a')
  return (anchors[anchors.length - 1] as HTMLAnchorElement | undefined) || null
}

function findFallbackCta(widget: HTMLElement): HTMLAnchorElement | null {
  const style = widget.getAttribute('data-style')
  if (style === 'minimal') {
    return (
      (widget.querySelector('a[style*="text-decoration:underline"]') as HTMLAnchorElement | null) ||
      getLastAnchor(widget)
    )
  }
  return (
    (widget.querySelector('a[style*="border-radius:9999px"]') as HTMLAnchorElement | null) ||
    getLastAnchor(widget)
  )
}

function updateCtaInHtml(html: string, ctaLabel: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const widgets = doc.querySelectorAll('.product-widget')
  widgets.forEach((widget) => {
    const el = widget as HTMLElement
    el.setAttribute('data-cta', ctaLabel)
    const ctaLink = el.querySelector('a.product-widget-cta') as HTMLAnchorElement | null
    if (ctaLink) {
      ctaLink.textContent = el.getAttribute('data-style') === 'minimal' ? `${ctaLabel} →` : ctaLabel
    } else {
      const fallback = findFallbackCta(el)
      if (fallback) {
        fallback.textContent = el.getAttribute('data-style') === 'minimal' ? `${ctaLabel} →` : ctaLabel
      }
    }
  })
  return doc.body.innerHTML
}

export function AdminBlogsList({ posts }: AdminBlogsListProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [ctaLabel, setCtaLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const allSelected = posts.length > 0 && selected.size === posts.length

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(posts.map((p) => p.slug)))
    }
  }

  function toggleSlug(slug: string) {
    const next = new Set(selected)
    if (next.has(slug)) {
      next.delete(slug)
    } else {
      next.add(slug)
    }
    setSelected(next)
  }

  async function handleBulkUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const label = ctaLabel.trim()
    if (!label) {
      setError('Enter a CTA label')
      return
    }
    if (selected.size === 0) {
      setError('Select at least one blog')
      return
    }

    setLoading(true)
    try {
      const selectedPosts = posts.filter((p) => selected.has(p.slug))
      for (const post of selectedPosts) {
        const updatedContent = updateCtaInHtml(post.content, label)
        const body = {
          title: post.title,
          content: updatedContent,
          status: post.status,
          published_at: post.publishedAt || null,
          excerpt: post.excerpt,
          image_url: post.image_url,
          author: post.author,
          category: post.category,
          tags: post.tags,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          social_visibility: post.socialVisibility,
        }
        const res = await fetch(`/api/admin/blogs/${post.slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `Failed to update "${post.title}"`)
        }
      }
      setSuccess(`Updated CTA label for ${selected.size} ${selected.size === 1 ? 'blog' : 'blogs'}`)
      setCtaLabel('')
      setSelected(new Set())
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-[#243027]">Blog Posts</h1>
          <p className="mt-2 text-sm text-[#243027]/50">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blogs/new"
            className="rounded-full bg-[#243027] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#76885B]"
          >
            + New Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-[#243027]/10 bg-white p-16 text-center">
          <p className="text-[#243027]/50">No blog posts yet. Create your first post.</p>
          <Link
            href="/admin/blogs/new"
            className="mt-6 inline-block rounded-full bg-[#243027] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#76885B]"
          >
            + New Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <form
            onSubmit={handleBulkUpdate}
            className="flex flex-wrap items-end gap-4 rounded-lg border border-[#243027]/10 bg-white p-4"
          >
            <div className="min-w-[200px] flex-1">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                New CTA Label
              </label>
              <input
                type="text"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Shop Now"
                className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || selected.size === 0}
              className="rounded-full bg-[#243027] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B] disabled:opacity-40"
            >
              {loading ? 'Updating...' : `Update ${selected.size} selected`}
            </button>
          </form>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-[#76885B]">{success}</p>}

          <div className="overflow-hidden rounded-lg border border-[#243027]/10 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#243027]/10 bg-[#F2F0EB]/50">
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-[#243027]/20 accent-[#76885B]"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">
                    Published
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">
                    Updated
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-[#243027]/5 transition-colors hover:bg-[#F2F0EB]/30"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(post.slug)}
                        onChange={() => toggleSlug(post.slug)}
                        className="h-4 w-4 rounded border-[#243027]/20 accent-[#76885B]"
                        aria-label={`Select ${post.title}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#243027]">{post.title}</div>
                      <div className="mt-1 font-mono text-xs text-[#243027]/30">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          post.status === 'published'
                            ? 'default'
                            : post.status === 'scheduled'
                              ? 'outline'
                              : 'secondary'
                        }
                        className={
                          post.status === 'published'
                            ? 'bg-[#76885B]/10 text-[#76885B] hover:bg-[#76885B]/20'
                            : post.status === 'scheduled'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'bg-[#243027]/5 text-[#243027]/50 hover:bg-[#243027]/10'
                        }
                      >
                        {post.status === 'published'
                          ? 'Published'
                          : post.status === 'scheduled'
                            ? 'Scheduled'
                            : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#243027]/60">{formatDate(post.publishedAt)}</td>
                    <td className="px-6 py-4 text-sm text-[#243027]/60">{formatDate(post.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/blogs/${post.slug}/edit`}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#76885B] transition-colors hover:text-[#243027]"
                        >
                          Edit
                        </Link>
                        <BlogDeleteButton slug={post.slug} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
