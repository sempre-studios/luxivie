'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from './RichTextEditor'
import { MediaPicker } from './MediaPicker'
import { SOCIAL_NETWORKS } from '@/lib/social'
import type { BlogPost } from '@/lib/blogs'

interface BlogFormProps {
  post?: BlogPost
  mode: 'create' | 'edit'
}

export function BlogForm({ post, mode }: BlogFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function toLocalDatetime(iso: string): string {
    const d = new Date(iso)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60 * 1000)
    return local.toISOString().slice(0, 16)
  }

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.image_url || '')
  const [author, setAuthor] = useState(post?.author || '')
  const [category, setCategory] = useState(post?.category || '')
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>(post?.status || 'draft')
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt ? toLocalDatetime(post.publishedAt) : '')
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '')
  const [suggestions, setSuggestions] = useState<{ categories: string[]; tags: string[] }>({ categories: [], tags: [] })
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [socialVisibility, setSocialVisibility] = useState<Record<string, boolean>>(
    post?.socialVisibility || {}
  )

  useEffect(() => {
    fetch('/api/admin/blogs/suggestions')
      .then(async (res) => {
        if (!res.ok) return
        const data = await res.json()
        setSuggestions({ categories: data.categories || [], tags: data.tags || [] })
      })
      .catch(() => {})
  }, [])

  const autoSlug = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setSlug(generated)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      const { url } = await res.json()
      setFeaturedImageUrl(url)
      setUploading(false)
    } catch {
      setError('Upload failed. Please try again.')
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content,
        image_url: featuredImageUrl.trim() || undefined,
        author: author.trim() || undefined,
        category: category.trim() || undefined,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
        seo_title: seoTitle.trim() || undefined,
        seo_description: seoDescription.trim() || undefined,
        social_visibility: socialVisibility,
      }

      const url = mode === 'create' ? '/api/admin/blogs' : `/api/admin/blogs/${post?.slug}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save post')
        setLoading(false)
        return
      }

      router.push('/admin/blogs')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title - full width */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
          Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-lg border-[#243027]/15 bg-white px-4 py-3 text-lg"
          placeholder="Post title"
        />
      </div>

      {/* Two-column layout: content editor on left, sidebar on right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column: Content editor */}
        <div className="flex flex-col space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
            Content *
          </Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your blog post..."
          />
        </div>

        {/* Right column: Sidebar fields */}
        <div className="space-y-6">
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Slug
            </Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-lg border-[#243027]/15 bg-white px-3 py-2.5 font-mono text-sm"
                placeholder="auto-generated"
              />
              <Button
                type="button"
                variant="outline"
                onClick={autoSlug}
                className="rounded-lg border-[#243027]/15 px-3 text-[10px] font-bold uppercase tracking-widest"
              >
                Auto
              </Button>
            </div>
            <p className="text-xs text-[#243027]/40">URL: /blog/{slug || 'auto-generated'}</p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-3"
              placeholder="Short summary shown in blog list"
            />
          </div>

          {/* Featured Image with upload + preview */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Featured Image
            </Label>

            {featuredImageUrl && (
              <div className="relative mb-2 overflow-hidden rounded-lg border border-[#243027]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImageUrl}
                  alt="Featured preview"
                  className="h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImageUrl('')}
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            )}

            <Input
              id="featuredImageUrl"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5 text-sm"
              placeholder="https://... or upload below"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-lg border-[#243027]/15 py-2.5 text-[10px] font-bold uppercase tracking-widest"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setMediaPickerOpen(true)}
              className="w-full rounded-lg border-[#243027]/15 py-2.5 text-[10px] font-bold uppercase tracking-widest"
            >
              Recent Images
            </Button>
            <MediaPicker
              open={mediaPickerOpen}
              onClose={() => setMediaPickerOpen(false)}
              onSelect={(url) => setFeaturedImageUrl(url)}
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Author
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5"
              placeholder="Author name"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Category
            </Label>
            <Input
              id="category"
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5"
              placeholder="e.g. Journal, Ritual Guides"
            />
            <datalist id="category-suggestions">
              {suggestions.categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              list="tag-suggestions"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5"
              placeholder="hair care, botanical, ritual"
            />
            <datalist id="tag-suggestions">
              {suggestions.tags.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Status
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published' | 'scheduled')}>
              <SelectTrigger className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Published at */}
          <div className="space-y-2">
            <Label htmlFor="publishedAt" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              {status === 'scheduled' ? 'Publish At' : 'Published At'}
            </Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="rounded-lg border-[#243027]/15 bg-white px-3 py-2.5 text-sm"
            />
          </div>

          {/* SEO Title */}
          <div className="space-y-2">
            <Label htmlFor="seoTitle" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              SEO Title
            </Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5"
              placeholder="Override page title for SEO"
            />
          </div>

          {/* SEO Description */}
          <div className="space-y-2">
            <Label htmlFor="seoDescription" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              SEO Description
            </Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className="rounded-lg border-[#243027]/15 bg-white px-4 py-3"
              placeholder="Meta description for search results"
            />
          </div>

          {/* Social Visibility */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Social Share Visibility
            </Label>
            <p className="text-xs text-[#243027]/40">Toggle which share buttons appear on this article. Defaults to all visible.</p>
            {SOCIAL_NETWORKS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialVisibility[key] !== false}
                  onChange={(e) => setSocialVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-[#243027]/20 accent-[#76885B]"
                />
                <span className="text-sm text-[#243027]">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#243027] px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#76885B]"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/blogs')}
          className="rounded-full border-[#243027]/15 px-8 py-4 text-[10px] font-bold uppercase tracking-widest"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
